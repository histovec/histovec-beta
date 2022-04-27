import Joi from 'joi'

import { generateReportRoute } from './reportCommon.js'
import { ID_REGEX } from '../../../constant/regex.js'

const reportByCodePayloadSchema = Joi.object({
  uuid: Joi.string().guid({
    version: ['uuidv4'],
    separator: '-',
  }).meta({ swaggerHidden: true }),
  vehicule: Joi.object({
    // @todo: Clean base64 encoding (EVERYWHERE) while merging private and public APIs
    code: Joi.string().pattern(ID_REGEX).required()
      .description('Code HistoVec du rapport HistoVec demandé.')
      .label('code_partage_histovec'),
  }).label('vehicule_by_code'),
  options: Joi.object({
    controles_techniques: Joi.boolean()
      .description('Récupérer les contrôles techniques du véhicule dans le rapport. Non par défaut.'),
    ignore_utac_cache: Joi.boolean().meta({ swaggerHidden: true }),
  }).label('controles_techniques_option_by_code'),
}).label('Report_by_code_payload')

export default generateReportRoute({ path: '/report_by_code', logLabel: 'PUBLIC_ROUTE_REPORT_BY_CODE', payloadSchema: reportByCodePayloadSchema })
