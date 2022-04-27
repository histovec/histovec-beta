import Joi from 'joi'

import { generateReportRoute } from './reportCommon.js'
import { NUMERO_FORMULE_REGEX, NUMERO_IMMATRICULATION_REGEX, SIREN_REGEX } from '../../../constant/regex.js'
import { DEFAULT_SIREN } from '../../../constant/siren.js'

const reportByDataPayloadSchema = Joi.object({
  uuid: Joi.string().guid({
    version: ['uuidv4'],
    separator: '-',
  }).meta({ swaggerHidden: true }),
  vehicule: Joi.object({
    certificat_immatriculation: Joi.object({
      titulaire: Joi.object({
        particulier: Joi.object({
          nom: Joi.string().trim()
            .description('Nom tel que renseigné sur le certificat d\'immatriculation.'),
          prenoms: Joi.array().items(Joi.string().allow('').trim())
            .description('Prénoms tels que renseignés sur le certificat d\'immatriculation. Renseigner un prénom par élément de liste.'),
        }).description('Remplir cette partie UNIQUEMENT si le véhicule appartient à un particulier.'),
        personne_morale: Joi.object({
          raison_sociale: Joi.string().trim()
            .description('Raison sociale telle que renseignée sur le certificat d\'immatriculation.'),
          siren: Joi.string().pattern(SIREN_REGEX).default(DEFAULT_SIREN)
            .description('Numéro de SIREN tel que renseigné sur le KBIS de l\'entreprise. Si vous êtes une personne morale sans SIREN, ne le remplissez pas.'),
        }).description('Remplir cette partie UNIQUEMENT si le véhicule appartient à une personne morale.'),
      }),
      numero_immatriculation: Joi.string().pattern(NUMERO_IMMATRICULATION_REGEX).required()
        .description('Numéro d\'immatriculation tel que renseigné sur le certificat d\'immatriculation.'),
      numero_formule: Joi.string().pattern(NUMERO_FORMULE_REGEX)
        .description('Numéro de formule tel que renseigné sur le certificat d\'immatriculation. Remplir UNIQUEMENT si le véhicule possède un numéro d\'immatriculation au format SIV.'),
      date_emission_certificat_immatriculation: Joi.date()
        .description('Date d\'émission du certificat d\'immatriculation telle que renseignée sur le certificat d\'immatriculation. Remplir UNIQUEMENT si le véhicule possède un numéro d\'immatriculation au format FNI.'),
    }),
  }).label('vehicule_by_data'),
  options: Joi.object({
    controles_techniques: Joi.boolean()
      .description('Récupérer les contrôles techniques du véhicule dans le rapport HistoVec. Désactivé par défaut.'),
    ignore_utac_cache: Joi.boolean().meta({ swaggerHidden: true }),
  }).label('controles_techniques_option_by_data'),
}).label('Report_by_data_payload')

export default generateReportRoute({ path: '/report_by_data', logLabel: 'PUBLIC_ROUTE_REPORT_BY_DATA', payloadSchema: reportByDataPayloadSchema })
