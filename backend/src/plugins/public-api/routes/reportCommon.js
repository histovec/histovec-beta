import Boom from '@hapi/boom'
import { appLogger, syslogLogger } from '../../../util/logger.js'
import { base64Decode, decryptJson, hash, base64Encode, urlSafeBase64Encode } from '../../../util/crypto.js'
import { getDepartement } from '../../../util/codePostal.js'
import { buildReportId, buildReportKey, buildIdAndKey } from '../util/report.js'
import { normalizeReport, normalizeControlesTechniques } from '../util/normalizeData.js'
import { vehiculeMapping, controlesTechniquesMapping } from '../util/mapping.js'
import { processControlesTechniques } from '../../../util/controlesTechniques.js'
import { checkPayload } from '../util/check/reportByData.js'
import { getReport } from '../handlers/report.js'
import { reportResponseSchema } from '../../schemas/report.js'

import { NUMERO_IMMATRICULATION_SIV_REGEX } from '../../../constant/regex.js'
import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '../../../constant/type.js'
import { TITULAIRE_CHANGE_OPERATIONS } from '../../../constant/historique.js'

import config from '../../../config.js'

const DEFAULT_UUID = config.isPublicApi ? config.apiUuid : ''

export const generateReportRoute = ({ path, logLabel, payloadSchema }) => {
  return {
    method: 'POST',
    path,
    options: {
      tags: ['api'],
      validate: {
        payload: payloadSchema,
      },
      response: {
        schema: reportResponseSchema,
      }
    },
    handler: async (request, h) => {
      const {
        uuid = DEFAULT_UUID,
        vehicule: {
          // report by code payload
          code,

          // report by data payload
          certificat_immatriculation: {
            titulaire: {
              particulier: {
                nom,
                prenoms,
              } = {},
              personne_morale: {
                raison_sociale: raisonSociale,
                siren,
              } = {},
            } = {},
            numero_immatriculation: numeroImmatriculation,
            date_emission_certificat_immatriculation: dateEmissionCertificatImmatriculation,
            numero_formule: numeroFormule,
          } = {},
        },
        options: {
          controles_techniques: askControlesTechniques,
          ignore_utac_cache: ignoreUtacCache,
        } = {},
      } = request.payload

      const { id, key, isInvalidCode } = buildIdAndKey(code)

      syslogLogger.info({ key: 'payload_code', tag: logLabel, value: { isInvalidCode, id, key, code } })

      if (isInvalidCode) {
        throw Boom.badRequest('Malformed HistoVec code')
      }

      const alreadyHasIdAndKey = Boolean(id) && Boolean(key)
      syslogLogger.info({ key: 'payload_data', tag: logLabel, value: { alreadyHasIdAndKey, nom, prenoms, raisonSociale, siren, numeroImmatriculation, numeroFormule, dateEmissionCertificatImmatriculation, id, key } })

      // If id param is present, it has been generated by frontend :
      // => it already has been Base64Encoded as needed
      let base64EncodedReportId = id

      // If key param is present, it has been generated by frontend :
      // => it already has been Base64Encoded as needed
      let base64EncodedReportKeyBuffer = key && Buffer.from(key, 'base64')

      if (!alreadyHasIdAndKey) {
        // As far as I know, Joi don't permit to validate as needed in this custom function
        checkPayload({ nom, prenoms, raisonSociale, siren, numeroImmatriculation, numeroFormule, dateEmissionCertificatImmatriculation })

        const typeImmatriculation = NUMERO_IMMATRICULATION_SIV_REGEX.test(numeroImmatriculation) ? TYPE_IMMATRICULATION.SIV : TYPE_IMMATRICULATION.FNI
        const typePersonne = nom ? TYPE_PERSONNE.PARTICULIER : TYPE_PERSONNE.PRO

        syslogLogger.info({ key: 'type_immatriculation', tag: logLabel, value: typeImmatriculation })
        syslogLogger.info({ key: 'type_personne', tag: logLabel, value: typePersonne })

        const reportIdBuffer = buildReportId(
          { nom, prenoms, raisonSociale, siren, numeroImmatriculation, numeroFormule, dateEmissionCertificatImmatriculation },
          { typeImmatriculation, typePersonne }
        )
        base64EncodedReportId = base64Encode(reportIdBuffer)

        base64EncodedReportKeyBuffer = buildReportKey(
          { numeroImmatriculation, numeroFormule, dateEmissionCertificatImmatriculation },
          { typeImmatriculation }
        )

        syslogLogger.info({
          key: 'sub_payload',
          tag: logLabel,
          value: {
            base64EncodedReportId,
            base64EncodedReportKey: base64EncodedReportKeyBuffer.toString('base64'),
          }
        })
      }

      const res = await getReport({
        uuid,
        id: base64EncodedReportId,
        options: {
          ignoreControlesTechniques: !askControlesTechniques,
          ignoreUtacCache,
        },
      })

      syslogLogger.info({
        key: 'res',
        tag: logLabel,
        value: {
          res,
        }
      })

      const { sivData, utacData: rawControlesTechniques, error, message } = res
      syslogLogger.info({
        key: 'sub-result',
        tag: logLabel,
        value: {
          sivData,
          rawControlesTechniques,
          error,
          message,
        }
      })

      syslogLogger.info({ key: 'encrypted_raw_report', tag: logLabel, value: { sivData, rawControlesTechniques, base64EncodedReportKeyBuffer } })

      const report = decryptJson(sivData, base64EncodedReportKeyBuffer)
      syslogLogger.info({ key: 'decrypted_raw_report', tag: logLabel, value: { ...report } })

      const normalizedReport = normalizeReport(report)
      syslogLogger.info({ key: 'normalized_report', tag: logLabel, value: { ...normalizedReport } })

      syslogLogger.info({ key: 'raw_controles_techniques', tag: logLabel, value: { ...rawControlesTechniques } })

      const mappedVehicule = vehiculeMapping(normalizedReport, config.isPublicApi)
      syslogLogger.info({ key: 'mapped_report', tag: logLabel, value: { ...mappedVehicule } })

      if (!askControlesTechniques) {
        const reportWithoutControlesTechniques = {
          vehicule: mappedVehicule,
        }
        syslogLogger.info({ key: 'report_without_controles_techniques', tag: logLabel, value: { ...reportWithoutControlesTechniques } })

        return reportWithoutControlesTechniques
      }


      const normalizedControlesTechniques = normalizeControlesTechniques(rawControlesTechniques)
      syslogLogger.info({ key: 'normalized_controles_techniques', tag: logLabel, value: { ...normalizedControlesTechniques } })

      const labeledControlesTechniques = processControlesTechniques(normalizedControlesTechniques)
      syslogLogger.info({ key: 'labeled_controles_techniques', tag: logLabel, value: { ...labeledControlesTechniques } })

      const mappedControlesTechniques = controlesTechniquesMapping(labeledControlesTechniques)
      syslogLogger.info({ key: 'mapped_controles_techniques', tag: logLabel, value: { ...mappedControlesTechniques } })

      const reportWithControlesTechniques = {
        vehicule: mappedVehicule,
        controles_techniques: mappedControlesTechniques,
      }
      syslogLogger.info({ key: 'report_with_controles_techniques', tag: logLabel, value: { ...reportWithControlesTechniques } })

      return reportWithControlesTechniques
    },
  }
}
