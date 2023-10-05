import Boom from '@hapi/boom'
import { verificationsData } from '../handlers/validationData.js'
import config from '../../../config.js'
import { vehiculeMapping } from '../util/mapper.js'

const DEFAULT_UUID = config.isPublicApi ? config.apiUuid : ''

export const genererReportRoute = ({ path, logLabel, payloadSchema, appelApiData }) => {
  return {
    method: 'POST',
    path,
    options: {
      tags: ['api'],
      validate: {
        payload: payloadSchema,
      },
    },
    handler: async (request, h) => {
      const uuid = request.payload && request.payload.uuid ? request.payload.uuid : DEFAULT_UUID
      let response

      // appel à l'API data
      try {
        response = await appelApiData(request, uuid)
      } catch (error) {
        const responseError = error.response

        if (responseError) {
          const message = responseError.statusText

          switch (responseError.status) {
            case 404:
              throw Boom.notFound(message)
            case 502:
              throw Boom.badGateway(message)
            case 503:
              throw Boom.serverUnavailable(message)
            case 500:
            default:
              throw Boom.serverUnavailable('Service indisponible.')
          }
        }

        throw Boom.serverUnavailable('Service indisponible.')
      }

      // traitement des datas
      verificationsData(response, uuid)
      const reponseMappe = vehiculeMapping(response.payload, config.isPublicApi)
      return reponseMappe
    },
  }
}
