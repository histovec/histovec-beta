import { getElasticsearchClient } from '../connectors/elasticsearch.js'
import { appLogger } from '../util/logger.js'
import config from '../config.js'


const elasticsearchClient = getElasticsearchClient()

export const getSIV = async (id, uuid) => {
  try {
    const response = await elasticsearchClient.search({
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
        error: 'No hit in Elasticsearch',
      })

      return {
        status: 404,
        message: 'Report not found',
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
      const message = 'Wrong data format in Elasticsearch response'

      appLogger.error({
        error: message,
        response: hits,
      })

      return {
        status: 500,
        message,
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
      const message = 'Unreachable database'
			appLogger.error({
        error: message,
        id,
        uuid,
        remote_error: errorMessage,
      })

      appLogger.info(`[SIV] ${uuid} undefined_undefined elasticsearch_down get_report ${id}`)
      appLogger.info('-- elasticsearch is down => cannot get SIV report from elasticsearch')

      return {
        status: 503,
        message,
        utac: {},
      }
    }

		const message = 'Couldn\'t process Elasticsearch response'

    appLogger.error({
      error: message,
      id,
      uuid,
      remote_error: errorMessage,
    })

    return {
      status: 500,
      message,
      utac: {},
    }
  }
}
