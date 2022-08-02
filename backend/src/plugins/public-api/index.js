import reportByData from './routes/reportByData.js'
import reportByCode from './routes/reportByCode.js'

export const plugin = {
  name: 'publicApi',
  version: '1.0.0',
  register: (server, options) => {
    const { apiPrefix } = options

    reportByData.path = apiPrefix + reportByData.path
    reportByCode.path = apiPrefix + reportByCode.path

    const routes = [reportByData, reportByCode]

    server.route(routes)
  },
}

export default plugin
