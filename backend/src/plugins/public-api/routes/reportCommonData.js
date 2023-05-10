import Boom from '@hapi/boom'

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
      let reponse

      try {
        reponse = await appelApiData(request)
      } catch (erreur) {
        const reponse = erreur.response

        if (reponse && reponse.status !== 200) {
          const message = reponse.statusText
          switch (reponse.status) {
            case 404:
              throw Boom.notFound(message)
            case 502:
              throw Boom.badGateway(message)
            case 503:
              throw Boom.serverUnavailable(message)
            case 500:
            default:
              throw Boom.badImplementation(message)
          }
        }

        throw Boom.serverUnavailable('Service indisponible.')
      }

      return reponse
    },
  }
}
