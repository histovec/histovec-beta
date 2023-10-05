import reportByData from './routes/reportByData.js'
import reportByCode from './routes/reportByCode.js'
import reportByDataSivPersonne from './routes/reportByDataSivPersonne.js'

export const plugin = {
  name: 'publicApi',
  version: '1.0.0',
  register: (server, options) => {
    const { apiPrefix } = options

    reportByData.path = apiPrefix + reportByData.path
    reportByCode.path = apiPrefix + reportByCode.path
    reportByDataSivPersonne.path = apiPrefix + reportByDataSivPersonne.path

    const routes = [reportByData, reportByCode, reportByDataSivPersonne]

    server.route(routes)
  },
}

export default plugin
