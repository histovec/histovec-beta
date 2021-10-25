import report from './routes/report.js'
import { appLogger } from '../../util/logger.js'

export const plugin = {
  name: 'privateApi',
  version: '1.0.0',
	register: (server, options) => {
    report.path = (
			options.private ?
			options.apiPrefix +	options.basePrivateUrl + report.path:
			options.apiPrefix + report.path
		)

		appLogger.info(`-- [PRIVATE] -- API ROUTE => ${report.path}`)  // @todo: remove after validation in development environment
		const routes = [report]

		for (const route of routes) {
			route.options.isInternal = options.private
			appLogger.info(`-- [PRIVATE] -- API isInternal => ${route.options.isInternal}`)  // @todo: remove after validation in development environment
		}

		server.route(routes)
	},
}

export default plugin