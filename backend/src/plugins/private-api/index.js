import report from './routes/report.js'
import { appLogger } from '../../util/logger.js'

export const plugin = {
  name: 'privateApi',
  version: '1.0.0',
	register: (server, options) => {
    report.path = options.apiPrefix + report.path

		appLogger.info(`-- [PRIVATE] -- API ROUTE => ${report.path}`)  // @todo: remove after validation in development environment

		server.route([report])
	},
}

export default plugin