import reportByData from './routes/reportByData.js'
import reportByCode from './routes/reportByCode.js'

import { appLogger } from '../../util/logger.js'

export const plugin = {
  name: 'publicApi',
  version: '1.0.0',
  register: (server, options) => {
    const { apiPrefix } = options

    reportByData.path = apiPrefix + reportByData.path
    appLogger.info(`-- [PUBLIC] -- API ROUTE => ${reportByData.path}`) // @todo: remove after validation in development environment

    reportByCode.path = apiPrefix + reportByCode.path
    appLogger.info(`-- [PUBLIC] -- API ROUTE => ${reportByCode.path}`) // @todo: remove after validation in development environment

    const routes = [reportByData, reportByCode]

    server.route(routes)
  },
}

export default plugin
