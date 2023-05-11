import { getElasticsearchClient } from '../connectors/elasticsearch.js'
import { syslogLogger } from '../util/logger.js'
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
      syslogLogger.warn({ key: 'elasticsearch_research_failed', tag: 'SIV', uuid })

      return {
        status: 404,
        message: 'Report not found',
        utac: {},
      }
    }

    const {
      v: sivData,
      utac_ask_ct: rawAskCt = '',
      utac_encrypted_immat: encryptedImmat = null,
      utac_encrypted_vin: encryptedVin = null,
    } = hits[0]._source

    const askCt = rawAskCt === 'OUI'
    syslogLogger.debug({ key: 'ask_ct_data', tag: 'UTAC', uuid, value: { encryptedVin } })
    syslogLogger.info({ key: 'ask_ct', tag: 'UTAC', uuid, value: { askCt, encryptedImmat } })

    if (!sivData) {
      syslogLogger.error({ key: 'elasticsearch_data_format_erreur', tag: 'SIV', uuid, value: { reponse: hits } })

      return {
        status: 500,
        message: 'Wrong data format in Elasticsearch response',
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
      syslogLogger.error({ key: 'elasticsearch_down_get_report_failed', tag: 'SIV', uuid, value: { error: errorMessage, id } })

      return {
        status: 503,
        message: 'Unreachable database',
        utac: {},
      }
    }

    syslogLogger.error({ key: 'elasticsearch_down', tag: 'SIV', uuid, value: { error: errorMessage, id } })

    return {
      status: 500,
      message: 'Couldn\'t process Elasticsearch response',
      utac: {},
    }
  }
}
