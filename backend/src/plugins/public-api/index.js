import reportByData from './routes/reportByData.js'
import { appLogger } from '../../util/logger.js'

export const plugin = {
  name: 'publicApi',
  version: '1.0.0',
  register: (server, options) => {
    const { apiPrefix, basePrivateUrl, privateApiReportPath } = options
    const privateApiReportUrl = `${apiPrefix}${basePrivateUrl}${privateApiReportPath}`

    server.expose('privateApiReportUrl', privateApiReportUrl)

    reportByData.path = options.apiPrefix + reportByData.path

		appLogger.info(`-- [PUBLIC] -- API ROUTE => ${reportByData.path}`)  // @todo: remove after validation in development environment
    const routes = [reportByData]

    server.route(routes)
  },
}

export default plugin
