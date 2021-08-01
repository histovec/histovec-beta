import Joi from 'joi'

import { generateReportRoute } from './reportCommon.js'

import { NUMERO_FORMULE_REGEX, PLAQUE_REGEX, SIREN_REGEX } from '../../../constant/regex.js'
import { SIREN_FOR_ASSOCIATION } from '../../../constant/siren.js'


const reportByDataPayloadSchema = Joi.object({
  vehicule: Joi.object({
    certificat_immatriculation: Joi.object({
      titulaire: Joi.object({
        particulier: Joi.object({
          nom: Joi.string().trim(),
          prenoms: Joi.array().items(Joi.string().trim()),
        }),
        personne_morale: Joi.object({
          raison_sociale: Joi.string().trim(),
          siren: Joi.string().pattern(SIREN_REGEX).default(SIREN_FOR_ASSOCIATION)
            .description('Si vous êtes une personne morale sans SIREN, ne le remplissez pas.'),
        }),
      }),
      // @todo: how to display custom error
      plaque_immatriculation: Joi.string().pattern(PLAQUE_REGEX),
      // @todo: how to display custom error
      numero_formule: Joi.string().pattern(NUMERO_FORMULE_REGEX),
      date_emission_certificat_immatriculation: Joi.date(),
    }),
  }),
  options: Joi.object({
    controles_techniques: Joi.boolean()
      .description('Récupérer les contrôles techniques du véhicule dans le rapport. Non par défaut.'),
  }),
})

export default generateReportRoute({ path: '/report-by-data', logLabel: 'PUBLIC_ROUTE_REPORT_BY_DATA', payloadSchema: reportByDataPayloadSchema })
