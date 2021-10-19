import reportByData from './routes/reportByData.js'
import reportByCode from './routes/reportByCode.js'

import { appLogger } from '../../util/logger.js'

export const plugin = {
  name: 'publicApi',
  version: '1.0.0',
  register: (server, options) => {
    const { apiPrefix, privateApiHost, privateApiPath } = options
    const privateReportApiUrl = `http://${privateApiHost}${apiPrefix}${privateApiPath}`
    appLogger.info(`-- [PUBLIC] -- PRIVATE API INDIRECTION URL => ${privateReportApiUrl}`)  // @todo: remove after validation in development environment

    server.expose('privateReportApiUrl', privateReportApiUrl)

    reportByData.path = options.apiPrefix + reportByData.path
    appLogger.info(`-- [PUBLIC] -- API ROUTE => ${reportByData.path}`)  // @todo: remove after validation in development environment

    reportByCode.path = options.apiPrefix + reportByCode.path
    appLogger.info(`-- [PUBLIC] -- API ROUTE => ${reportByCode.path}`)  // @todo: remove after validation in development environment

    server.route([reportByData, reportByCode])
  },
}

export default plugin
