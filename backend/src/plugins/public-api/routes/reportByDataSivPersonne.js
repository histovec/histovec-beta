import Joi from 'joi'
import { NUMERO_FORMULE_REGEX, NUMERO_IMMATRICULATION_REGEX } from '../../../constant/regex.js'
import { ApiDataCLient } from '../../../services/api-data.js'
import { syslogLogger } from '../../../util/logger.js'
import { genererReportRoute } from './reportCommonData.js'

const reportByDataPayloadSchema = Joi.object({
  uuid: Joi.string().guid({
    version: ['uuidv4'],
    separator: '-',
  }).meta({ swaggerHidden: true }),
  particulier: Joi.object({
    nom: Joi.string().trim().required()
      .description('Nom tel que renseigné sur le certificat d\'immatriculation.'),
    prenoms: Joi.array().items(Joi.string().allow('').trim()).required()
      .description('Prénoms tels que renseignés sur le certificat d\'immatriculation. Renseigner un prénom par élément de liste.'),
  }).description('Information du particulier.'),
  vehicule: Joi.object({
    numero_immatriculation: Joi.string().pattern(NUMERO_IMMATRICULATION_REGEX).required()
      .description('Numéro d\'immatriculation tel que renseigné sur le certificat d\'immatriculation.'),
    numero_formule: Joi.string().pattern(NUMERO_FORMULE_REGEX).required()
      .description('Numéro de formule tel que renseigné sur le certificat d\'immatriculation. Remplir UNIQUEMENT si le véhicule possède un numéro d\'immatriculation au format SIV.'),
  }).label('vehicule_by_data'),
  options: Joi.object({
    controles_techniques: Joi.boolean()
      .description('Récupérer les contrôles techniques du véhicule dans le rapport HistoVec. Désactivé par défaut.'),
  }).label('controles_techniques_option_by_data'),
}).label('Report_by_data_payload')

const apiData = new ApiDataCLient()

const appelApiData = async (request, uuid) => {
  const {
    particulier: {
      nom,
      prenoms,
    } = {},
    vehicule: {
      numero_immatriculation: numeroImmatriculation,
      numero_formule: numeroFormule,
    } = {},
  } = request.payload

  const data = {
    nom,
    prenom: prenoms[0],
    immat: numeroImmatriculation,
    numero_formule: numeroFormule,
  }

  let response = null

  try {
    syslogLogger.info({ key: 'api_data_call_siv_physique_start', tag: 'API_DATA', uuid, value: data })
    response = await apiData.getSivPhysique('400e3437-aa6a-4c8f-81b2-819fe27a2d65', data)
  } catch (error) {
    syslogLogger.error({ key: 'api_data_call_siv_physique_failed', tag: 'API_DATA', uuid, value: { status: error.response.status, statusText: error.response.statusText, code: error.code, message: error.message, method: error.config.method } })
    throw error
  }

  return response
}

export default genererReportRoute({ path: '/report_by_data/siv/personne', logLabel: 'PUBLIC_ROUTE_REPORT_BY_DATA', payloadSchema: reportByDataPayloadSchema, appelApiData })
