import Joi from 'joi'
import { DATE_FR_REGEX, HTTP_STATUS_CODE_REGEX, TIME_REGEX, UTAC_CENTRE_REGEX, UTAC_NUMERO_IMMATRICULATION_REGEX, VIN_REGEX } from '../../../constant/regex.js'
import { NATURE, RESULTAT } from '../../../constant/controlesTechniques.js'
import { HTTP_CODES } from '../../../constant/http.js'

const UTAC_RESPONSE_PREFIX = 'utac-resp-'


export const utacResponseSchema = Joi.object({
  status: Joi.number().integer().valid(...Object.values(HTTP_CODES)).required().description('Statut HTTP.'),
  update_date: Joi.string().pattern(DATE_FR_REGEX).required().description('Date de mise à jour de la donnée.'),
  ct: Joi.array().items(
    Joi.object({
      ct_centre: Joi.string().allow(null).pattern(UTAC_CENTRE_REGEX).description('Identifiant du centre de contrôle.'),
      ct_date: Joi.string().pattern(DATE_FR_REGEX).required().description('Date du contrôle technique.'),
      ct_deb: Joi.string().allow(null).pattern(TIME_REGEX).description('Heure de début du contrôle technique.'),
      ct_fin: Joi.string().allow(null).pattern(TIME_REGEX).description('Heure de fin du contrôle technique.'),
      ct_id: Joi.number().integer().required().description('Identifiant par véhicule du contrôle technique, croissant par ordre chronologique.'),
      ct_immat: Joi.string().allow(null).pattern(UTAC_NUMERO_IMMATRICULATION_REGEX).description('Les immatriculations sont transmises pour le format SIV en majuscule avec tiret, pour le format FNI en majuscule.'),
      ct_km: Joi.number().integer().min(0).required().description('Relevé du kilométrage à la date du contrôle technique.'),
      ct_nature: Joi.string().valid(...Object.values(NATURE)).required().description('Nature du contrôle VTP Visite Technique Périodique (avant 20/05/2018) Contrôle Technique Périodique (après 20/05/2018), VTC Visite Technique Complémentaire (avant 20/05/2018) Contrôle Technique Complémentaire, CV Contre-Visite, CVC Contre-Visite Complémentaire.'),
      ct_pv: Joi.string().allow(null).description('Identifiant du procès verbal au sein du centre de contrôle.'),
      ct_resultat: Joi.string().valid(...Object.values(RESULTAT)).required().description('A Contrôle technique périodique ou contre-visite favorable, AP Contrôle technique complémentaire ou contre-visite complémentaire favorable, S Visite technique périodique ou contre-visite défavorable (avant 20/05/2018), S Contrôle technique périodique ou contre-visite défavorable pour défaillances majeures (après 20/05/2018), SP Visite complémentaire ou contre-visite complémentaire défavorable (avant 20/05/2018), SP Contrôle technique complémentaire ou contre-visite complémentaire défavorable pour défaillances majeures (après 10/05/2018), R Véhicule soumis à contre-visite avec interdiction de circuler (poids lourds avant 20/05/2018), R Contrôle technique périodique ou contre-visite défavorable pour défaillances critiques (après 20/05/2018), RP Contrôle technique complémentaire ou contre-visite complémentaire défavorable pour défaillances critiques (après 20/05/2018), X Report de la visite - renvoi du véhicule (avant 20/05/2018).'),
      ct_vin: Joi.string().allow(null).pattern(VIN_REGEX).description('Le VIN est transmis en majuscule sur 1 à 17 caractères.'),
    }).description('Date de mise à jour de la donnée.')
      .label(`${UTAC_RESPONSE_PREFIX}controles_techniques`)
  )
})
