import Joi from 'joi'

import { generateReportRoute } from './reportCommon.js'


const reportByIdPayloadSchema = Joi.object({
  vehicule: Joi.object({
    id: Joi.string().base64({ paddingRequired: true, urlSafe: true }).max(44).required()  // @todo: remove urlSafe in v2
			.description('Identifiant du rapport HistoVec demandé.'),
    key: Joi.string().base64({ paddingRequired: true, urlSafe: true }).required()  // @todo: remove urlSafe in v2
      .description('Clé de déchiffrement du rapport HistoVec demandé.'),
  }).label('code_partage_histovec'),
  options: Joi.object({
    controles_techniques: Joi.boolean()
      .description('Récupérer les contrôles techniques du véhicule dans le rapport. Non par défaut.'),
  }),
}).label('Report_by_id_payload')

export default generateReportRoute({ path: '/report-by-id', logLabel: 'PUBLIC_ROUTE_REPORT_BY_ID', payloadSchema: reportByIdPayloadSchema })
