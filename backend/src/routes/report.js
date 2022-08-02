import elasticsearch from '../connectors/elasticsearch'
import {
  encryptJson,
  decryptXOR,
  checkId,
  checkUuid,
  hash,
  urlSafeBase64Encode,
} from '../util/crypto'
import config from '../config'
import { appLogger } from '../util/logger'
import { getAsync, setAsync } from '../connectors/redis'

import { VIN_REGEX } from '../constant/regex.js'

// /!\ boolean setting is passed as string /!\
// @todo: we should use typed yaml to load settings
const isVinSentToUtac = config.utac.isVinSentToUtac === true || config.utac.isVinSentToUtac === 'true'

const normalizeImmatForUtac = (immat) => {
  if (!immat || typeof immat !== 'string') {
    return undefined
  }
  return (
    immat.toUpperCase()
      .replace(/^([A-Z]+)(\s|-)*([0-9]+)(\s|-)*([A-Z]+)$/, '$1-$3-$5')
      .replace(/^([0-9]+)(\s|-)*([A-Z]+)(\s|-)*([0-9]+)$/, '$1$3$5')
  )
}

const getSIV = async (id, uuid) => {
  try {
    const response = await elasticsearch.Client.search({
      index: config.esSIVIndex,
      body: {
        query: {
          multi_match: {
            query: id,
            fields: ['ida1', 'ida2'],
          },
        },
      },
      size: 1,
      terminate_after: 1,
      filter_path: `
        hits.hits._source.v,
        hits.hits._source.utac_ask_ct,
        hits.hits._source.utac_encrypted_immat,
        hits.hits._source.utac_encrypted_vin,
        hits.hits._source.controle_qualite`,
    })

    const hits = (response && response.hits && response.hits.hits) || []

    if (hits.length <= 0) {
      appLogger.warn({
        error: 'No hit',
      })

      return {
        status: 404,
        message: 'Not Found',
        utac: {},
      }
    }

    const {
      v: sivData,
      utac_ask_ct: rawAskCt = '',
      utac_encrypted_immat: encryptedImmat = '',
      utac_encrypted_vin: encryptedVin = '',
      controle_qualite: controleQualite = '',
    } = hits[0]._source

    appLogger.info(`-- controle_qualite ==> ${controleQualite}`)

    const askCt = rawAskCt === 'OUI'
    appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} ask_ct ${askCt}`)

    if (!sivData) {
      appLogger.error({
        error: 'Bad Content in elasticsearch response',
        response: hits,
      })

      return {
        status: 500,
        message: 'Bad Content from Elasticsearch',
        utac: {},
      }
    }

    return {
      status: 200,
      sivData,
      utac: {
        askCt,
        encryptedImmat,
        encryptedVin,
      },
    }
  } catch ({ message: errorMessage }) {
    if (errorMessage === 'No Living connections') {
      appLogger.error({
        error: 'Elasticsearch service not available',
        id,
        uuid,
        remote_error: errorMessage,
      })

      return {
        status: 502,
        message: errorMessage,
        utac: {},
      }
    }

    appLogger.error({
      error: 'Couldn\'t process Elasticsearch response',
      id,
      uuid,
      remote_error: errorMessage,
    })

    return {
      status: 500,
      message: errorMessage,
      utac: {},
    }
  }
}

const validateTechnicalControls = (sentVin, technicalControls) => {
  const inconsistentVin = technicalControls.find(ct => ct.ct_vin !== sentVin)

  if (inconsistentVin) {
    appLogger.error({
      message: 'VINs are differents',
    })
    return false
  }

  // Immatriculations could have change while changing from FNI to SIV

  return true
}

// Use a default value to compute utacDataKey for annulationCI vehicles
const computeUtacDataKey = (encryptedImmat = 'h4ZWsQLmpOZf') => {
  const urlSafeBase64UtacIdHash = hash(encryptedImmat)
  const truncatedUtacIdHash = Buffer.from(urlSafeBase64UtacIdHash, 'base64').slice(0, 32).toString('base64')

  return {
    utacDataKey: truncatedUtacIdHash,
    utacDataKeyAsBuffer: Buffer.from(truncatedUtacIdHash, 'base64'),
  }
}

export const generateGetReport = (utacClient) =>
  async (req, res) => {
    const { id, uuid, options: { ignoreUtacCache } } = req.body
    appLogger.warn(`-- CONFIG -- ignoreUtacCache => ${ignoreUtacCache}`)

    appLogger.info(`-- idv ==> ${id}`)

    if (!checkUuid(uuid) || !checkId(id)) {
      appLogger.error({
        error: 'Bad request - invalid uuid or id',
        id: id,
        uuid: uuid,
      })

      res.status(400).json({
        success: false,
        message: 'Bad Request',
      })
      return
    }

    // 1 - SIV
    const {
      status: sivStatus,
      message: sivMessage,
      sivData,
      utac: {
        askCt,
        encryptedImmat,
        encryptedVin,
      },
    } = await getSIV(id, uuid)

    if (sivStatus !== 200) {
      res.status(sivStatus).json({
        success: false,
        message: sivMessage,
      })
      return
    }

    const immat = decryptXOR(encryptedImmat, config.utacIdKey)
    appLogger.debug(`-- immat ==> ${immat}`)

    // 2 - UTAC

    // Utac data encryption is not really useful since UTAC api doesn't return crypted data.
    // But we still encrypt to sent coherent format to the front: encrypted siv and utac data.
    // Since HistoVec uses https, it is not a security issue.

    const { utacDataKey, utacDataKeyAsBuffer } = computeUtacDataKey(encryptedImmat)

    // /!\ boolean setting is passed as string /!\
    // @todo: we should use typed yaml to load settings
    const isApiActivated = config.utac.isApiActivated === true || config.utac.isApiActivated === 'true'

    // Only annulationCI vehicles don't have encryptedImmat
    const isAnnulationCI = Boolean(!encryptedImmat)
    if (!askCt || isAnnulationCI || !isApiActivated) {
      if (!askCt) {
        appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} no_call ask_ct_false`)
      }

      if (isAnnulationCI) {
        appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} no_call annulation_CI`)
      }

      if (!isApiActivated) {
        appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} no_call api_not_activated`)
      }

      res.status(200).json({
        success: true,
        sivData,
        utacData: encryptJson({
          ct: [],
          ctUpdateDate: null,
        }, utacDataKeyAsBuffer),
        utacDataKey,
      })
      return
    }

    const emptyUtacData = encryptJson({
      ct: [],
      ctUpdateDate: null,
    }, utacDataKeyAsBuffer)

    const utacDataCacheId = urlSafeBase64Encode(id)
    const utacData = await getAsync(utacDataCacheId)

    if (ignoreUtacCache) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} ignore_cache`)
    }

    if (!ignoreUtacCache && utacData) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_cached`)

      try {
        // res.status(200).json({
        //   success: true,
        //   sivData,
        //   utacData,
        //   utacDataKey,
        // })
        res.status(200).json({
          success: true,
          sivData: 'g6BlAZGQvLwiyasMuollqgX4KBehqsOf6wNxqWm96D27FGm5siJStM0QxEWM_Ba7XR_T2rUAf77Gr38yjRaPhRoZaxbOqRJPi9LZewLrHfXPqVC94h0RgSezNSUEyhyaNPp87CYtH769b_woH9gTJImO2mUkW3YsGJY9etpmCf-o8Dr9WwS-YMfw2hxQI06hmzsKe71ooVuerC7dZiIAAWIgJDEGTVzQ-01uzXJNLhq8VWDw4B7FrABFgOej196_8vKUwM5jt2m5BeH_Cs8LmTOfwhiJhYtaaB-8PIWi_vksSkhrOHRa1wW0k3v-AdvjjRqQtajApYQY5eCsJfDXBQziZEW2B685BMEDMsgo24B6JOeqncyzuPTiQm6MD_H5xHj-WW6daDgw6NJzqWXDzTJJqcwxLinCV57li2bGyboF7gn7R_gHoFdaRIuLI7ZdEh9JMWvi0DSq72B49nRjEtdXa48pI4UMsJ8Q9y8LOIl-7FHfURbu5ErZTPRXsjXnGeNKBY1VzWhvodKnmo5Xvc2NOQ0Nf3O13S_po-WdngJv4cW5idg10RSqvX1P6VGb8A9ls55oY5Qm7-bnLYoOiRpP6UNNBgRVaGuYA4otsX5jDD44bX8JVWYuFyBCBSSKe4FcrBHZ60X8vZM6hY8JH_uh2UdcyJzJAEGlFUy-b4edbSbPf11FrqehDzUYrvtdgdLspz1OVnBEjcM7EXHIJvIueKzLD_ol9mfmLz4h-5NAqdNFDRatsj-qmD1FtPaBsNyrXTpYz5E8hkDQXq_DiFkrN9GmiaAhOhNzpdqlA342ikQ_FFl_jck10Kr6qIlswU2Qn2ZYEEtGYvnGF8td8uPTvgKATjv3kGqkEK2vCVvMRzRYYvRy_cLMGkKQqlMqYoIJEemmaeEZC9toOiZkknV47MVr-ET06CD3BJPLbWM0Do-UgjJCMNg5aUI_MLl_mOMDOREGnCDctej0bKksqTkya4JshUHRT4-tLrXEjPXRi7AMFB8ssHV_v8Wx2-J_C9wjUvR0wDpzfwYoQmkw1l_OE49L7xtfPgcUuBVMTZZrMo-ePYyYHZB4JuO0uisz12SsIoHEIMTBPNZOusNvYnFd5-fyRH-cLSQK3hffoJ-x5W2lbt_fVd20FREd2PGRmxMZjc0udtaWcNN0lptL09oHFq_CAarF9IWpNXKeOtY1MKjNpX1aufEGKcAYxONZlOVKdvOAxGFr0-DFpEtjrYphXIRPd62hVeFCyLkQ-k4Gv9adigrdvD-WUy1808sSM8LD4yHBzFoU4mNBr_ZSTZ-fcbceaqIUeVpS9zOv2MVVkoSvFrS_TqpdVQ60FxByrpvn5_EInvWvMKX6HR2JOMwmkiuYTEfVA9hcywToD6R0vsG5dbG4zKowwh4YzRKf2LSow1IXjDN_v50fCrR7sq_pkrIf-YRrlLKMJ7inD363-HSP1DE6fEociDXnoV0nuF3d47o4iRG3r9ttNcsj4t5qllPij1GeSfbzyWKX1f0YpOeeWFhgbv6JjWT7nSgY0mBL0AvztR2VDFmtLWs1upss6HVLy0NekV5MruH3spZuhPeQnXWJYETQQF9mr0p71cA-xcrQeTZwmWHadN35ybH9Da62gHwKlnmdRumTx8V_ajaZZysx6Fdqp-wT_ateJ1SdQIvd8-x-IA1pY7NS1-dMABqY54GkUFfcy-7tuqz6F-anA8OlZ0h-xI9sN92Pp3SI0s8AukwJUB7QvLn2B_98OToGPGjk97qJXr3X15HFcUlBhCOpzkpURwe935aWurqmujk7hTC19JRGtvaKYXQQwH6-KjytWhS2I3X_MHVJ1QTMxTB20waTkb7XMKVAOqy5SdwxYq8t5bgQrdq3AgLUDBznjJJFHewESpXXgTEt4xuLBUFn6e18wtriU7jGIeEVc1NUWwf16VrEcbBZV4taIh0BJQ43a2w3JQcsVnLjNwXI50Z7CheRdFY_oG4vEH-W_QF11CrvFudPtHI-40fZwryq1-AeOQqx6ULpO89cpmux-RMijlE9rs05WMGcR8CmzbegM-ii9W4VePtnFSr1_VurGe03U0rTMUmMM953U9u8i707-o9uGw1yEbX22cjGINdvOmg9D2o81tNlehKbphE06edrnpwsQ7bquYFZCqjyMOL9Y5c1ajJrolIGBR0Vdq-udBvAEnwnzYFOVk_pZSAUcmBqJ8_-olFFDb3chvy_RPuOpINPWDxj12reAig3OCO4-aYQiHdZR-F1Xha1LrpR16gs9AKgvOIoWOJUrAPKEAdR1az2hcwrF25VzsxUlAI2FF6tMFHkxcAkOufXQ0HwCh8LczIgLCbo86DPBSQ9t9ApN-mUNF77i4VJtxqDwim2kOQEvo2zSnyuu58DEvPk7ZBXnHdl4beOh5vOAjD7ll75c7R2WBFOxlzO9n9r9Frs1v2N3TM41CjBja65gsa73pL-pOMKSv0J-Wem0_qYWwzgd2tlrwTaH4pitlAtNUAPJDFv_MrhCybz7hBdZLOSjmsmpj8P8aVX2kiWzgpPlIeo-EuzRnWbBep0',
          utacData: 'BMxmvpDuNpbHrpH1NEu6qNtzVZaUpt_FNuCgut8ll_c2V3kYe5nP1jIPL_2zFxpkGseIVGuHcHUOP4FVCWQuX2vTIqmhVuFjPenyGTRSqk-9gaFQN7mQbL9wH_9BncCU2jLw8Sh8VBpqGob-4_jmTyW-apnvQKL0td2ZiRW4qBT-iHNbvvZ1-u3YjsJfYSYty1AAVuUm5mX-F8TFYfegbp9jaCoFSDkNhY_4YwGcFHDt6wS1ZU2qIuTg9jfcTvFVRafnsWSBejTUQ_06-xcNFlawxfPqRajs3HQeGb6agtkmJCsWvdZRrdT0nMXBfhYn40tIYfuBCWjUal-PqPr-1u6n9tDiv1BzARWQkHNVRvslK9dOz4mYebB4cY0VE8bMKuyPS1dVucfMirIIB2X_438DLggUH-jpwEqD73H0-rLxasHQxNR8pbPHQeuYpRymD6eGMqIWerL-MqKg_xAw4AMOJkmC1PX33U-JEAXBeHnDP3xxt6aj_O7746oXHuvFxzuRqZkKfBDJj41lESLxUWbt02oCNnMJvZJHvmpTYqhxYv28jB_KV5c5sF7KsMeGD8x_Je5_GCIz19U0EoVhUzM63inc0itL4XyUUJHpdzwyh6eniplK4JdTF-OEpRhnN-HhAvfx4IOGvoZpTsHJnXpnnwbf_zXRGGWlL32aw68ZoVHPN7zEJcIFTW9yrHBPpcGVtypINBd17F6BGO4rJbKoLUQOb1zKsqMQGg1cNLDJTuKtDjytT857a9lGBENtZP6KUHjQ0BwcT-83uzZaGX8yh844VpZsWaZpLyNJF9giGy2ehfy6MLgcGdcg0jfg8OJFwzdpihxQl8_Le0ZUXpiFDNAwSyWWlCi27AsT8q9j_I-FzoK2HXW4j1FbN95y1wYvheQfsx6BSuHRMWwbahTW-8ampMjOz9d3TSx3KqUv4yzCYt0qWOrcpORRruKXYzr_Y_Rh5VlYM_7Z-LBVmZDgOIQCDbhRTTEu9P0gZG3S4L9BDTH882l150VN02aZlXZDaUr1gg2SyC-xPKlqaIJX2eRPJ8eAdoEvnNi1Y3phkfZz3JiOEl6LH0APz6tgSV6WWbZ7MAoacv2-qbTT4kDqWNt-xAM0snBTgw5OGWUBGkxAVYcYBx3kDttVbz_44nkrtq6mdilx1rNk7KT1chAujD0OsVD8SW-u2tHtNyBvJEDhxMT0pJq9JTYY4V77rznX31ro96pRsnYk7eQlDmN6eiKAkV5mmD3DEiTcOX9ts-slORPDTwKUsoh1uemNSEXUjPpSzymcAqTNcl5am-SxLOEtR-G9W-eAMsU-NEjBvMZ0_CKwLfoiTm9ZcmtLYdgLR6fvPzKwPQeU80lkRrYmM_eQSbAuCXGwhI0wfqd9u6gBg6ybNed2xea2fUPH52KV1ghuolnUnvDJvHXMnD7EHlqBfd6Imy3dmBcPL9M2aRloASAXtMXOqDY28ykDlaLIM91nw8Qt_ajEIWP_-x0NoqbU1VeYLpkvKDhE45FJsAJKBw9lGMmfnVon1S5HUGPwMgp6jNlBSJ83d32czJ33A16MlLUUil0u7PrGFqtExV96sW2w2v7mE8AtKGHMwXvesP-oRhrHIhZHyxr2bSwGabaCX-iR_mQRdbRGBYq45KeQDSodsc6iXcKdqrUe41x-iTJbJfBkuDGeHCZux2rlUY0Q-bFegJw1699Fjrp16Zor1oA_u9CTM3tNoHd4qMOcmLk84vfDJFPWBA6mUOd9GAKCHGBKZBOme-N-LTlahrqOVs7boEnK7G2fVnEoSnx0x_1zoFYUlNuFqLL2bbHVf5Ex8kYJ5PMFTMzTBauis0iotjbTptl4IQvcxFKb8i40TkbKPKf4ZVCiWnjsNT7P7thyvfAosCI8ZLMcVQQNKQmXbpHy1uy9k0WRRSPawdBip4Ns1HM-JEgUbl0_CY_UV_fDJDt6gggKhxdnKcdY8rBOogbriOkBhi12mmOnjfteKtZbuhRgiIL-MMDvRUv6YvsE3OxqMbkQVGx6hZlyKMxPiLkV2Ukpyzsi9nKmcsSvQGkeaYRv54Aq2yato0ksH1k98Pu-xHkI5oDFwelr_D0gBiUiiAaHyTzaMJvANIrIG6e0SNVKddvVLEWLT4gkHdLKj1oPNOhaHuetfYEywUI56KOD8qNDBNNQ9atHFnRFwNR9aJh_y6xfXR-q6WC6msPxbvwU0Ok34FMn-Y4J3nKGdQa50W7M3HLbnkT_HSrtq4_iIdXxWAV0LCO-9NOsbyRd3jcva6-lg9fjR1hXRJB8kCHrSyHuMLRaN8_Xjo6jY0ID21T_M_dU2EmxlN5LmAEVZbVkUI0-cABr8abFdx0aBbSBO9nKPSz8QhGAysFrA0T2-cf82awnw-ixGIa-g54KWXYPKTeUBwx78nWS5LJpSRrfubVxRqSAdlY2zsMm_-Vc6jsx3rb1Q0724wFC2pNUG3iuxr9BvpdVONL0sSPmZlVS-5s3R647Nwc9Vhr7MO-LYRQMYNQs7T-AlzOPIUfEjX30wUSk27dPEKgM6QOTUfrqxR2rffmteT2rrAU8wVrlaXT6JZg3FvCczF3RoSS9VGMP20SEGs4J493zxVVHw0VWg0EgI_6G_VUNb1uI1NKlxwZOythELi7TvD3n2qM2NW681WB5XGvGEvvUG8sl8pl-ZSy-l-5Z0iuNgsna8zVOxtMzy4nTmODajVZYpsnC6Zv6tMQx_8r5U0ibx-IUWDet_Ua2KclbBv2TS_Ct1vFs7cgU6eZyuRUQxaSlvy3RcWhJ1N0e0kBQ0olIrT5MCerETc-IbxV_eaCdhs2GK2w7k7G06o-zNpzmGZI0gmi_lpq2HgAX_2DCi0nhLfhaaJXfL0HZYtsWgRkFM2R04mjh9HB7dGnSIlU43wIrugu0eXg6kRt4eeQPUxgyDhSRM6sZPRCBruCNt0pLm4V6hzCRGCQL78tQASah89rJtL7NdBUg5bHfyMgyMnECmNdcVYO1-kiHr6pAGEj3KgQA3LviCp_E25h3tr9TGWPuojYcBnkrS1lsUYaiC9WKv5GU2OI_lsVOXkexphj4QPNu4CIRTUFJvriquix_LP4F_1ZP4bUAEyOAPXB51O0SeHbVwqqHQtrURRmHL_l8a4VrE4QExXDQndxoE_vB9YjmxmV_DTlpbpvRW-qngRh5__6wx8YES1m-F4Zspfb6uYaK-xg4rADCqJunflFGVbWDV6r3S5CasI4sbtXpi4dcCdpi1EhwHIgms_tQ2pIrzJFRpfiZ5vRwFc_f6sZDw3GJmYHvkYLkRCdefXYJhmuZhBw_ItLkhH8zlSrNzcjm7aaOp6fEfTfT8tNusnIfAmVwC-uEU78MjFKoegZgnwwPgGXiZVCIJvzmAWsJtWbF-l7Nvq_2MhAPly2bdp0n2DUUrIfkw8jkSexXU3eLERjNtn8h8UZWy1HlLkKqcpLjT8ZZpQiJhAutLv4kpWuSffngSQM5qxZyU-Ny8Iv9SBJAzXJ3YChdMbNDAIX1ZQ6ziymxdrcvyNe4j_Yx07Ww12uV1g4fk29uDDHGwdp2akeTymz7eWtgCVCdUlYaGNl5jmmNGO1mvr0eb9HHJLFLh8CP_5yPU_V7OENtCQQpUHKUE4s-IPoXOtb4psnW3dY8ZcKwyYPyzycnd2C4EarJRqDTKzQdM58ppa3DuNJCoFregf1r_Mdxh51BmJDAoehuhSSCym9WiG7mqJaUkt4PHTePlAtRYNsG_oGNwoC2oKGt50NO3O7E_mCjuTF-Ay1tvRfqsyDn6re2GicxsbcXYy3u09mjOOiSsbZLvzTtl5RDGPCS6CTSGlLn7f1uW6-f6AxvUvpUAo22XwSfcSaS5_r2RqmXD3GDtCA1pKjOqYEmjlwtw5bfRrXndIUzeWKPumPFR8ZIsDZ29dkHry56tpqNev5R3fzfJ2wIAGWpk9V0mLLPzCMg47N9ou9_vvllpbFCMq5k-Rre8H_1c2y-9kwalPxE-7zwDHrUK02Ooly7hl_O8cvhYRrIs8UE0R5trEOxZtJbyMqpJbgqjsJjXdHU2sbBd1kxkkmUoUBdZGKNWAvE3MO3oMLejOoBFZBkL_PO9vDDXNxe9d1cB6GugfJr9rTZUbXHgno3fL0sDg6YfyvR6xf5ZFVn4sJm-FJ8h1ciaND75XEzRr8Hxsgs6g1Izy8sPDTdgVajOtERPb-mFpSknb3FlVPalmiSWSoO7CW7xZEZYfcaS5k8cISPYR5N3cIeankRSlVMEOoyMoSJlLoY1agdqLA53Gl5cTb7uyLW4Ph6xyhf0bze8G3enm28plsrz3PkCM2-Ha1R9yvRZ3kEDSN_FoqMFosSnp8Sj9MrYjWm2ndPMhvVHEIdWQAX6Lx2QeZ-3_Pjes5A-M00DNtRhlMe6gB7GY-_UL55L7T3NRtcz4e5HtlFBnp0KeI8eBtBCw3OEfStPnncJ0yZvZ3qI6e3cxS8pOIGoUFtOkUdgDeROl83CRxZcimTZOIs3H0SMfHyfI_H-px8wnqDh33TQeN1VetXB_ilapK7m712Wyp0pIZl8Rr3DmBKpNS_BQF7NMtoyCUzAFGnuR2vZ3zZn6IgesdkjpqUrLwDUVonOYNquhjsBljUOlcmMu2sNMOpmomYYy-CQW9JnVG1xrYeMnb7_UtLIc5iyI5bfEg8QIOhISDQYcCMFt7obGxdcVqbGXWgh15aJsw9lPZ90nN8CcXp0cGbr_rAbBD4VaYJRNg_FeeDWO8KaRai9KqQbjDhfpUi91S78AuoR-C0NlXdgtn-98k2HT-Rjqa0p4Gfs_3TH8oH_q92B4FhELGDzVR8qruAje2PiJK0D16CoRRvj8EIdzPka-hySCnEytDtF8Te_RL0L30SiQp8XEZ8gJrcd9XiFkD3PAYpr-NMJvW_NFWeMjDBeryGZLwnqzuUB1HzwUse11XK8f3FfJ4eztyAmuYEyjP5wpJRGfsuZcF2UwBmZYbSSGi9l20DfXIyQunAWULlrfU634_iwz7fNS_dlnOhJxBt3gGhHorX_UHxe8qffByy6AduoK7yR38tqknauxwcQiXjZp4HR0L3TN_uN1w-juWa49oJ25nyJBrUYFrzY9TfvDpYThX4cR2obHMGu9cqxoJda6oNoOgj-XUPN-R7F16I9h7ns7MJFFHpbwQN7CzL3De9x6WVyJPQA6kacZYYcAeWvjLwZyEPxv66ki6ZGyXS-DcAJmiDompm4J5S0rSlojPOAkv7gabCF-e9x5eIawjHhklnmAmKF32MOPRpTOLSNVcJ_5FrDkrxlg6071h65oLD52YrIkaxWcwAJMoGFKb58BVl4Cweo5KoYnQopn-LJ7MhyAo39GP3eCOHFKc4zRvJbZkZEEEOpcSR5i2jK1yHTMxELP3AdLvj0UNGkj8rDFFeNDqhNEkvHLpxLKxFJUHfhBg2K5sRBaA3CmZos2wFI3HK6t6ykjJbXrChZYQCWF411_aFO1CcXX7j9t2uYmTt89V3VC2CQ9Nxw-Rd4CUGVoOnWTx2thwXsOgEadYlZhvngsXHwVJcV3BsptCWgH7Hp4MKePuem7ESNsIExbiesIOs-kfd4hHDEIOnd72koyu-iUqCRqvf_JPlxw36PFHUT9x9_I0_iy-tzXhl6lKCd7oURi4k6CrwSpun98-HTllIgaVxkiEokKBC-Vs1Loj0cX-SNxKCVZ-mugCuO4iupYoJf4vq8_SuWNfUmyqnFI5Bx-VnZExIFzJxmqxFIWmztxN9eC28ihPeHrDQ6XCnikcnyjdDK1YFeHsfs4fGL5OgcNQXOSolm7R-DD5GiLsg-evFYJ1iu7iTLcJ6HD_SMfyOBkUXcR-cpZSmd1TMyGFP2aNZU0EscswjBMeGVqbLD2GXQ_TQOvoxvvYuSDOe70F32x0TbdaGH98Ovt7oPA79GaMJx0IfgY_DNwAf2zyI-KlvQabJWfVvK-VrDjaEZxTiR4AtSyx0nvDbIBLc6_oc6RHFX5JNjZxDaiDZtcHbIP-7isavC7oGr2FWZRg06RIDtYGZtbMW_K_4tfD6clU-p3s7a7DcP3lSTzhKiK6EQbN0ySu0PQJRuM9YDpDCim59DvIHp9ssiTA0AfuKu-85LuB5ibR3p1H-fuvAHQII5oXl707r09PjA0q1teXwKqoAFM6xlxPpN2LluLx4Zcdm5hNzmJs0xDZvB_xt36nYp80MG72WnJIw-ur6wEdjRJ1-8HF-rued22SWupWjJSSoctG1aTaGxrmBBiH6PPy-ipOcVLAwsUArZzuBbb2otH9IGQSjO6M2qdnH2P4jx-5Bb80x8IZ52yraWEyz6s3HlQNUbdvf_7UvaJpjVRLAURNm8eDNlOAZNrh51M-Sa05h0Vc9d--v55Ix0_TfqA4FlbuQrzh53hAvWzDQP85BvmCD_X_a2mcm45VqGdAVH7JbzCWTvNIQnVlyHDtNRARVyyScla24ANn7sv2U9Pvvr9T18IKQKhD9IE_JU_Soj0Sfn9ZGmZHy748r2N6pYegDUGZ8kaS4hIXSiiJoCju90PGUsMwstjIPIYIhu03txEJW0yFg4sUdjtyl9usL8rtBKPWa',
          utacDataKey: 'etcVpW6hbaAgyT1ELewJJH7cQ0qoIAYqzxZWMW/M5/E='
        })
        return
      } catch (error) {
        appLogger.error({
          error: "Couldn't decrypt cached UTAC response",
          remote_error: error.message,
        })

        // Let's asking UTAC api to fix it
      }
    }

    const normalizedImmat = normalizeImmatForUtac(immat)
    appLogger.debug(`-- normalized immat ==> ${normalizedImmat}`)

    const validImmatRegex = /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}|[0-9]{1,4}[ ]{0,}[A-Z]{1,3}[ ]{0,}[0-9]{1,3}$/
    const isValidImmat = Boolean(validImmatRegex.test(normalizedImmat))

    const vin = encryptedVin ? decryptXOR(encryptedVin, config.utacIdKey) : ''
    appLogger.debug(`-- vin ==> ${vin}`)

    const normalizedVin = vin.toUpperCase()
    appLogger.debug(`-- normalized vin ==> ${normalizedVin}`)

    const isValidVin = Boolean(VIN_REGEX.test(vin))

    if (!isValidImmat) {
      appLogger.error({
        error: `Invalid immatriculation for UTAC api`,
      })

      // Cache unsupported vehicles
      await setAsync(
        utacDataCacheId,
        emptyUtacData,
        'EX',
        config.redisPersit
      )

      res.status(200).json({
        success: true,
        sivData,
        utacData: emptyUtacData,
        utacDataKey,
      })
      return
    }

    if (isVinSentToUtac && !isValidVin) {
      appLogger.warn({
        error: `Malformed VIN`,
      })
    }

    try {
      const {
        status: utacStatus,
        message: utacMessage,
        ct,
        updateDate: ctUpdateDate,
      } = await utacClient.readControlesTechniques({
        immat: normalizedImmat,
        vin: normalizedVin,
      },
      {
        uuid, encryptedImmat, encryptedVin,
      })

      if (utacStatus !== 200) {
        appLogger.error({
          error: 'UTAC response failed',
          status: utacStatus,
          remote_error: utacMessage,
        })

        if (utacStatus === 404 || utacStatus === 406) {
          // Cache unsupported vehicles
          await setAsync(
            utacDataCacheId,
            emptyUtacData,
            'EX',
            config.redisPersit
          )

          res.status(200).json({
            success: true,
            sivData,
            utacData: emptyUtacData,
            utacDataKey,
          })
          return
        }

        // Don't cache errors
        res.status(200).json({
          success: true,
          sivData,
          utacData: encryptJson({
            ct: [],
            ctUpdateDate: null,
            utacError: utacMessage,
          }, utacDataKeyAsBuffer),
          utacDataKey,
        })
        return
      }

      if (isVinSentToUtac && !validateTechnicalControls(vin, ct)) {
        throw new Error('Inconsistency for technical control')
      }

      const freshUtacData = encryptJson({
        ct,
        ctUpdateDate,
      }, utacDataKeyAsBuffer)

      // Cache supported vehicles
      await setAsync(
        utacDataCacheId,
        freshUtacData,
        'EX',
        config.redisPersit
      )

      // res.status(200).json({
      //   success: true,
      //   sivData,
      //   utacData: freshUtacData,
      //   utacDataKey,
      // })

      res.status(200).json({
        success: true,
        sivData: 'g6BlAZGQvLwiyasMuollqgX4KBehqsOf6wNxqWm96D27FGm5siJStM0QxEWM_Ba7XR_T2rUAf77Gr38yjRaPhRoZaxbOqRJPi9LZewLrHfXPqVC94h0RgSezNSUEyhyaNPp87CYtH769b_woH9gTJImO2mUkW3YsGJY9etpmCf-o8Dr9WwS-YMfw2hxQI06hmzsKe71ooVuerC7dZiIAAWIgJDEGTVzQ-01uzXJNLhq8VWDw4B7FrABFgOej196_8vKUwM5jt2m5BeH_Cs8LmTOfwhiJhYtaaB-8PIWi_vksSkhrOHRa1wW0k3v-AdvjjRqQtajApYQY5eCsJfDXBQziZEW2B685BMEDMsgo24B6JOeqncyzuPTiQm6MD_H5xHj-WW6daDgw6NJzqWXDzTJJqcwxLinCV57li2bGyboF7gn7R_gHoFdaRIuLI7ZdEh9JMWvi0DSq72B49nRjEtdXa48pI4UMsJ8Q9y8LOIl-7FHfURbu5ErZTPRXsjXnGeNKBY1VzWhvodKnmo5Xvc2NOQ0Nf3O13S_po-WdngJv4cW5idg10RSqvX1P6VGb8A9ls55oY5Qm7-bnLYoOiRpP6UNNBgRVaGuYA4otsX5jDD44bX8JVWYuFyBCBSSKe4FcrBHZ60X8vZM6hY8JH_uh2UdcyJzJAEGlFUy-b4edbSbPf11FrqehDzUYrvtdgdLspz1OVnBEjcM7EXHIJvIueKzLD_ol9mfmLz4h-5NAqdNFDRatsj-qmD1FtPaBsNyrXTpYz5E8hkDQXq_DiFkrN9GmiaAhOhNzpdqlA342ikQ_FFl_jck10Kr6qIlswU2Qn2ZYEEtGYvnGF8td8uPTvgKATjv3kGqkEK2vCVvMRzRYYvRy_cLMGkKQqlMqYoIJEemmaeEZC9toOiZkknV47MVr-ET06CD3BJPLbWM0Do-UgjJCMNg5aUI_MLl_mOMDOREGnCDctej0bKksqTkya4JshUHRT4-tLrXEjPXRi7AMFB8ssHV_v8Wx2-J_C9wjUvR0wDpzfwYoQmkw1l_OE49L7xtfPgcUuBVMTZZrMo-ePYyYHZB4JuO0uisz12SsIoHEIMTBPNZOusNvYnFd5-fyRH-cLSQK3hffoJ-x5W2lbt_fVd20FREd2PGRmxMZjc0udtaWcNN0lptL09oHFq_CAarF9IWpNXKeOtY1MKjNpX1aufEGKcAYxONZlOVKdvOAxGFr0-DFpEtjrYphXIRPd62hVeFCyLkQ-k4Gv9adigrdvD-WUy1808sSM8LD4yHBzFoU4mNBr_ZSTZ-fcbceaqIUeVpS9zOv2MVVkoSvFrS_TqpdVQ60FxByrpvn5_EInvWvMKX6HR2JOMwmkiuYTEfVA9hcywToD6R0vsG5dbG4zKowwh4YzRKf2LSow1IXjDN_v50fCrR7sq_pkrIf-YRrlLKMJ7inD363-HSP1DE6fEociDXnoV0nuF3d47o4iRG3r9ttNcsj4t5qllPij1GeSfbzyWKX1f0YpOeeWFhgbv6JjWT7nSgY0mBL0AvztR2VDFmtLWs1upss6HVLy0NekV5MruH3spZuhPeQnXWJYETQQF9mr0p71cA-xcrQeTZwmWHadN35ybH9Da62gHwKlnmdRumTx8V_ajaZZysx6Fdqp-wT_ateJ1SdQIvd8-x-IA1pY7NS1-dMABqY54GkUFfcy-7tuqz6F-anA8OlZ0h-xI9sN92Pp3SI0s8AukwJUB7QvLn2B_98OToGPGjk97qJXr3X15HFcUlBhCOpzkpURwe935aWurqmujk7hTC19JRGtvaKYXQQwH6-KjytWhS2I3X_MHVJ1QTMxTB20waTkb7XMKVAOqy5SdwxYq8t5bgQrdq3AgLUDBznjJJFHewESpXXgTEt4xuLBUFn6e18wtriU7jGIeEVc1NUWwf16VrEcbBZV4taIh0BJQ43a2w3JQcsVnLjNwXI50Z7CheRdFY_oG4vEH-W_QF11CrvFudPtHI-40fZwryq1-AeOQqx6ULpO89cpmux-RMijlE9rs05WMGcR8CmzbegM-ii9W4VePtnFSr1_VurGe03U0rTMUmMM953U9u8i707-o9uGw1yEbX22cjGINdvOmg9D2o81tNlehKbphE06edrnpwsQ7bquYFZCqjyMOL9Y5c1ajJrolIGBR0Vdq-udBvAEnwnzYFOVk_pZSAUcmBqJ8_-olFFDb3chvy_RPuOpINPWDxj12reAig3OCO4-aYQiHdZR-F1Xha1LrpR16gs9AKgvOIoWOJUrAPKEAdR1az2hcwrF25VzsxUlAI2FF6tMFHkxcAkOufXQ0HwCh8LczIgLCbo86DPBSQ9t9ApN-mUNF77i4VJtxqDwim2kOQEvo2zSnyuu58DEvPk7ZBXnHdl4beOh5vOAjD7ll75c7R2WBFOxlzO9n9r9Frs1v2N3TM41CjBja65gsa73pL-pOMKSv0J-Wem0_qYWwzgd2tlrwTaH4pitlAtNUAPJDFv_MrhCybz7hBdZLOSjmsmpj8P8aVX2kiWzgpPlIeo-EuzRnWbBep0',
        utacData: 'BMxmvpDuNpbHrpH1NEu6qNtzVZaUpt_FNuCgut8ll_c2V3kYe5nP1jIPL_2zFxpkGseIVGuHcHUOP4FVCWQuX2vTIqmhVuFjPenyGTRSqk-9gaFQN7mQbL9wH_9BncCU2jLw8Sh8VBpqGob-4_jmTyW-apnvQKL0td2ZiRW4qBT-iHNbvvZ1-u3YjsJfYSYty1AAVuUm5mX-F8TFYfegbp9jaCoFSDkNhY_4YwGcFHDt6wS1ZU2qIuTg9jfcTvFVRafnsWSBejTUQ_06-xcNFlawxfPqRajs3HQeGb6agtkmJCsWvdZRrdT0nMXBfhYn40tIYfuBCWjUal-PqPr-1u6n9tDiv1BzARWQkHNVRvslK9dOz4mYebB4cY0VE8bMKuyPS1dVucfMirIIB2X_438DLggUH-jpwEqD73H0-rLxasHQxNR8pbPHQeuYpRymD6eGMqIWerL-MqKg_xAw4AMOJkmC1PX33U-JEAXBeHnDP3xxt6aj_O7746oXHuvFxzuRqZkKfBDJj41lESLxUWbt02oCNnMJvZJHvmpTYqhxYv28jB_KV5c5sF7KsMeGD8x_Je5_GCIz19U0EoVhUzM63inc0itL4XyUUJHpdzwyh6eniplK4JdTF-OEpRhnN-HhAvfx4IOGvoZpTsHJnXpnnwbf_zXRGGWlL32aw68ZoVHPN7zEJcIFTW9yrHBPpcGVtypINBd17F6BGO4rJbKoLUQOb1zKsqMQGg1cNLDJTuKtDjytT857a9lGBENtZP6KUHjQ0BwcT-83uzZaGX8yh844VpZsWaZpLyNJF9giGy2ehfy6MLgcGdcg0jfg8OJFwzdpihxQl8_Le0ZUXpiFDNAwSyWWlCi27AsT8q9j_I-FzoK2HXW4j1FbN95y1wYvheQfsx6BSuHRMWwbahTW-8ampMjOz9d3TSx3KqUv4yzCYt0qWOrcpORRruKXYzr_Y_Rh5VlYM_7Z-LBVmZDgOIQCDbhRTTEu9P0gZG3S4L9BDTH882l150VN02aZlXZDaUr1gg2SyC-xPKlqaIJX2eRPJ8eAdoEvnNi1Y3phkfZz3JiOEl6LH0APz6tgSV6WWbZ7MAoacv2-qbTT4kDqWNt-xAM0snBTgw5OGWUBGkxAVYcYBx3kDttVbz_44nkrtq6mdilx1rNk7KT1chAujD0OsVD8SW-u2tHtNyBvJEDhxMT0pJq9JTYY4V77rznX31ro96pRsnYk7eQlDmN6eiKAkV5mmD3DEiTcOX9ts-slORPDTwKUsoh1uemNSEXUjPpSzymcAqTNcl5am-SxLOEtR-G9W-eAMsU-NEjBvMZ0_CKwLfoiTm9ZcmtLYdgLR6fvPzKwPQeU80lkRrYmM_eQSbAuCXGwhI0wfqd9u6gBg6ybNed2xea2fUPH52KV1ghuolnUnvDJvHXMnD7EHlqBfd6Imy3dmBcPL9M2aRloASAXtMXOqDY28ykDlaLIM91nw8Qt_ajEIWP_-x0NoqbU1VeYLpkvKDhE45FJsAJKBw9lGMmfnVon1S5HUGPwMgp6jNlBSJ83d32czJ33A16MlLUUil0u7PrGFqtExV96sW2w2v7mE8AtKGHMwXvesP-oRhrHIhZHyxr2bSwGabaCX-iR_mQRdbRGBYq45KeQDSodsc6iXcKdqrUe41x-iTJbJfBkuDGeHCZux2rlUY0Q-bFegJw1699Fjrp16Zor1oA_u9CTM3tNoHd4qMOcmLk84vfDJFPWBA6mUOd9GAKCHGBKZBOme-N-LTlahrqOVs7boEnK7G2fVnEoSnx0x_1zoFYUlNuFqLL2bbHVf5Ex8kYJ5PMFTMzTBauis0iotjbTptl4IQvcxFKb8i40TkbKPKf4ZVCiWnjsNT7P7thyvfAosCI8ZLMcVQQNKQmXbpHy1uy9k0WRRSPawdBip4Ns1HM-JEgUbl0_CY_UV_fDJDt6gggKhxdnKcdY8rBOogbriOkBhi12mmOnjfteKtZbuhRgiIL-MMDvRUv6YvsE3OxqMbkQVGx6hZlyKMxPiLkV2Ukpyzsi9nKmcsSvQGkeaYRv54Aq2yato0ksH1k98Pu-xHkI5oDFwelr_D0gBiUiiAaHyTzaMJvANIrIG6e0SNVKddvVLEWLT4gkHdLKj1oPNOhaHuetfYEywUI56KOD8qNDBNNQ9atHFnRFwNR9aJh_y6xfXR-q6WC6msPxbvwU0Ok34FMn-Y4J3nKGdQa50W7M3HLbnkT_HSrtq4_iIdXxWAV0LCO-9NOsbyRd3jcva6-lg9fjR1hXRJB8kCHrSyHuMLRaN8_Xjo6jY0ID21T_M_dU2EmxlN5LmAEVZbVkUI0-cABr8abFdx0aBbSBO9nKPSz8QhGAysFrA0T2-cf82awnw-ixGIa-g54KWXYPKTeUBwx78nWS5LJpSRrfubVxRqSAdlY2zsMm_-Vc6jsx3rb1Q0724wFC2pNUG3iuxr9BvpdVONL0sSPmZlVS-5s3R647Nwc9Vhr7MO-LYRQMYNQs7T-AlzOPIUfEjX30wUSk27dPEKgM6QOTUfrqxR2rffmteT2rrAU8wVrlaXT6JZg3FvCczF3RoSS9VGMP20SEGs4J493zxVVHw0VWg0EgI_6G_VUNb1uI1NKlxwZOythELi7TvD3n2qM2NW681WB5XGvGEvvUG8sl8pl-ZSy-l-5Z0iuNgsna8zVOxtMzy4nTmODajVZYpsnC6Zv6tMQx_8r5U0ibx-IUWDet_Ua2KclbBv2TS_Ct1vFs7cgU6eZyuRUQxaSlvy3RcWhJ1N0e0kBQ0olIrT5MCerETc-IbxV_eaCdhs2GK2w7k7G06o-zNpzmGZI0gmi_lpq2HgAX_2DCi0nhLfhaaJXfL0HZYtsWgRkFM2R04mjh9HB7dGnSIlU43wIrugu0eXg6kRt4eeQPUxgyDhSRM6sZPRCBruCNt0pLm4V6hzCRGCQL78tQASah89rJtL7NdBUg5bHfyMgyMnECmNdcVYO1-kiHr6pAGEj3KgQA3LviCp_E25h3tr9TGWPuojYcBnkrS1lsUYaiC9WKv5GU2OI_lsVOXkexphj4QPNu4CIRTUFJvriquix_LP4F_1ZP4bUAEyOAPXB51O0SeHbVwqqHQtrURRmHL_l8a4VrE4QExXDQndxoE_vB9YjmxmV_DTlpbpvRW-qngRh5__6wx8YES1m-F4Zspfb6uYaK-xg4rADCqJunflFGVbWDV6r3S5CasI4sbtXpi4dcCdpi1EhwHIgms_tQ2pIrzJFRpfiZ5vRwFc_f6sZDw3GJmYHvkYLkRCdefXYJhmuZhBw_ItLkhH8zlSrNzcjm7aaOp6fEfTfT8tNusnIfAmVwC-uEU78MjFKoegZgnwwPgGXiZVCIJvzmAWsJtWbF-l7Nvq_2MhAPly2bdp0n2DUUrIfkw8jkSexXU3eLERjNtn8h8UZWy1HlLkKqcpLjT8ZZpQiJhAutLv4kpWuSffngSQM5qxZyU-Ny8Iv9SBJAzXJ3YChdMbNDAIX1ZQ6ziymxdrcvyNe4j_Yx07Ww12uV1g4fk29uDDHGwdp2akeTymz7eWtgCVCdUlYaGNl5jmmNGO1mvr0eb9HHJLFLh8CP_5yPU_V7OENtCQQpUHKUE4s-IPoXOtb4psnW3dY8ZcKwyYPyzycnd2C4EarJRqDTKzQdM58ppa3DuNJCoFregf1r_Mdxh51BmJDAoehuhSSCym9WiG7mqJaUkt4PHTePlAtRYNsG_oGNwoC2oKGt50NO3O7E_mCjuTF-Ay1tvRfqsyDn6re2GicxsbcXYy3u09mjOOiSsbZLvzTtl5RDGPCS6CTSGlLn7f1uW6-f6AxvUvpUAo22XwSfcSaS5_r2RqmXD3GDtCA1pKjOqYEmjlwtw5bfRrXndIUzeWKPumPFR8ZIsDZ29dkHry56tpqNev5R3fzfJ2wIAGWpk9V0mLLPzCMg47N9ou9_vvllpbFCMq5k-Rre8H_1c2y-9kwalPxE-7zwDHrUK02Ooly7hl_O8cvhYRrIs8UE0R5trEOxZtJbyMqpJbgqjsJjXdHU2sbBd1kxkkmUoUBdZGKNWAvE3MO3oMLejOoBFZBkL_PO9vDDXNxe9d1cB6GugfJr9rTZUbXHgno3fL0sDg6YfyvR6xf5ZFVn4sJm-FJ8h1ciaND75XEzRr8Hxsgs6g1Izy8sPDTdgVajOtERPb-mFpSknb3FlVPalmiSWSoO7CW7xZEZYfcaS5k8cISPYR5N3cIeankRSlVMEOoyMoSJlLoY1agdqLA53Gl5cTb7uyLW4Ph6xyhf0bze8G3enm28plsrz3PkCM2-Ha1R9yvRZ3kEDSN_FoqMFosSnp8Sj9MrYjWm2ndPMhvVHEIdWQAX6Lx2QeZ-3_Pjes5A-M00DNtRhlMe6gB7GY-_UL55L7T3NRtcz4e5HtlFBnp0KeI8eBtBCw3OEfStPnncJ0yZvZ3qI6e3cxS8pOIGoUFtOkUdgDeROl83CRxZcimTZOIs3H0SMfHyfI_H-px8wnqDh33TQeN1VetXB_ilapK7m712Wyp0pIZl8Rr3DmBKpNS_BQF7NMtoyCUzAFGnuR2vZ3zZn6IgesdkjpqUrLwDUVonOYNquhjsBljUOlcmMu2sNMOpmomYYy-CQW9JnVG1xrYeMnb7_UtLIc5iyI5bfEg8QIOhISDQYcCMFt7obGxdcVqbGXWgh15aJsw9lPZ90nN8CcXp0cGbr_rAbBD4VaYJRNg_FeeDWO8KaRai9KqQbjDhfpUi91S78AuoR-C0NlXdgtn-98k2HT-Rjqa0p4Gfs_3TH8oH_q92B4FhELGDzVR8qruAje2PiJK0D16CoRRvj8EIdzPka-hySCnEytDtF8Te_RL0L30SiQp8XEZ8gJrcd9XiFkD3PAYpr-NMJvW_NFWeMjDBeryGZLwnqzuUB1HzwUse11XK8f3FfJ4eztyAmuYEyjP5wpJRGfsuZcF2UwBmZYbSSGi9l20DfXIyQunAWULlrfU634_iwz7fNS_dlnOhJxBt3gGhHorX_UHxe8qffByy6AduoK7yR38tqknauxwcQiXjZp4HR0L3TN_uN1w-juWa49oJ25nyJBrUYFrzY9TfvDpYThX4cR2obHMGu9cqxoJda6oNoOgj-XUPN-R7F16I9h7ns7MJFFHpbwQN7CzL3De9x6WVyJPQA6kacZYYcAeWvjLwZyEPxv66ki6ZGyXS-DcAJmiDompm4J5S0rSlojPOAkv7gabCF-e9x5eIawjHhklnmAmKF32MOPRpTOLSNVcJ_5FrDkrxlg6071h65oLD52YrIkaxWcwAJMoGFKb58BVl4Cweo5KoYnQopn-LJ7MhyAo39GP3eCOHFKc4zRvJbZkZEEEOpcSR5i2jK1yHTMxELP3AdLvj0UNGkj8rDFFeNDqhNEkvHLpxLKxFJUHfhBg2K5sRBaA3CmZos2wFI3HK6t6ykjJbXrChZYQCWF411_aFO1CcXX7j9t2uYmTt89V3VC2CQ9Nxw-Rd4CUGVoOnWTx2thwXsOgEadYlZhvngsXHwVJcV3BsptCWgH7Hp4MKePuem7ESNsIExbiesIOs-kfd4hHDEIOnd72koyu-iUqCRqvf_JPlxw36PFHUT9x9_I0_iy-tzXhl6lKCd7oURi4k6CrwSpun98-HTllIgaVxkiEokKBC-Vs1Loj0cX-SNxKCVZ-mugCuO4iupYoJf4vq8_SuWNfUmyqnFI5Bx-VnZExIFzJxmqxFIWmztxN9eC28ihPeHrDQ6XCnikcnyjdDK1YFeHsfs4fGL5OgcNQXOSolm7R-DD5GiLsg-evFYJ1iu7iTLcJ6HD_SMfyOBkUXcR-cpZSmd1TMyGFP2aNZU0EscswjBMeGVqbLD2GXQ_TQOvoxvvYuSDOe70F32x0TbdaGH98Ovt7oPA79GaMJx0IfgY_DNwAf2zyI-KlvQabJWfVvK-VrDjaEZxTiR4AtSyx0nvDbIBLc6_oc6RHFX5JNjZxDaiDZtcHbIP-7isavC7oGr2FWZRg06RIDtYGZtbMW_K_4tfD6clU-p3s7a7DcP3lSTzhKiK6EQbN0ySu0PQJRuM9YDpDCim59DvIHp9ssiTA0AfuKu-85LuB5ibR3p1H-fuvAHQII5oXl707r09PjA0q1teXwKqoAFM6xlxPpN2LluLx4Zcdm5hNzmJs0xDZvB_xt36nYp80MG72WnJIw-ur6wEdjRJ1-8HF-rued22SWupWjJSSoctG1aTaGxrmBBiH6PPy-ipOcVLAwsUArZzuBbb2otH9IGQSjO6M2qdnH2P4jx-5Bb80x8IZ52yraWEyz6s3HlQNUbdvf_7UvaJpjVRLAURNm8eDNlOAZNrh51M-Sa05h0Vc9d--v55Ix0_TfqA4FlbuQrzh53hAvWzDQP85BvmCD_X_a2mcm45VqGdAVH7JbzCWTvNIQnVlyHDtNRARVyyScla24ANn7sv2U9Pvvr9T18IKQKhD9IE_JU_Soj0Sfn9ZGmZHy748r2N6pYegDUGZ8kaS4hIXSiiJoCju90PGUsMwstjIPIYIhu03txEJW0yFg4sUdjtyl9usL8rtBKPWa',
        utacDataKey: 'etcVpW6hbaAgyT1ELewJJH7cQ0qoIAYqzxZWMW/M5/E='
      })
    } catch ({ message: errorMessage }) {
      appLogger.error({
        error: 'UTAC error',
        remote_error: errorMessage,
      })

      // Don't cache errors
      res.status(200).json({
        success: true,
        sivData,
        utacData: encryptJson({
          ct: [],
          ctUpdateDate: null,
          utacError: errorMessage,
        }, utacDataKeyAsBuffer),
        utacDataKey,
      })
    }
  }
