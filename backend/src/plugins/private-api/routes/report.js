import Joi from 'joi'
import Boom from '@hapi/boom'

import { getReport } from '../handlers/report.js'
import config from '../../../config.js'


export default {
	method: 'POST',
	path: '/report',
	options: {
		validate: {
			payload: Joi.object({
				uuid: Joi.string().guid({
					version: ['uuidv4'],
					separator: '-',
				}).required()
					.description('Identifiant anonyme (pour réaliser des statistiques métier).'),
				id: Joi.string().base64({ paddingRequired: true, urlSafe: true }).max(44).required()  // @todo: remove urlSafe in v2
					.description('Identifiant du rapport HistoVec demandé.'),
				options: Joi.object({
					ignoreTechnicalControls: Joi.boolean()
						.description('Ne pas récupérer les contrôles techniques du véhicule dans le rapport.'),
					ignoreUtacCache: Joi.boolean()
						.description('Outrepasser le cache des contrôles techniques.'),
				}),
			}),
		},
		response: {
			schema: Joi.object({
				success: Joi.boolean(),  // @todo remove when frontend will no longer use it
				sivData: Joi.string().base64({ paddingRequired: true, urlSafe: true }).required()  // @todo: remove urlSafe in v2
					.description('Données du rapport du véhicule chiffrées.'),
				utacData: Joi.string().base64({ paddingRequired: true, urlSafe: true }).required()  // @todo: remove urlSafe in v2
					.description('Contrôles techniques du véhicule chiffrés.'),
				utacDataKey: Joi.string().base64({ paddingRequired: true }).required()
					.description('Clé de déchiffrement des contrôles techniques du véhicule.'),
			}),
		},
	},
	handler: getReport,
}
