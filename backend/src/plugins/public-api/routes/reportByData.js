import Joi from 'joi'

import { generateReportRoute } from './reportCommon.js'

import { NUMERO_FORMULE_REGEX, PLAQUE_REGEX, SIREN_REGEX } from '../../../constant/regex.js'
import { SIREN_FOR_ASSOCIATION } from '../../../constant/siren.js'


const reportByDataPayloadSchema = Joi.object({
  vehicule: Joi.object({
    certificat_immatriculation: Joi.object({
      titulaire: Joi.object({
        particulier: Joi.object({
          nom: Joi.string().trim()
            .description('Nom tel que renseigné sur le certificat d\'immatriculation.'),
          prenoms: Joi.array().items(Joi.string().trim())
            .description('Prénoms tels que renseignés sur le certificat d\'immatriculation. Renseigner un prénom par élément de liste.'),
        }).description('Remplir cette partie UNIQUEMENT si le véhicule appartient à un particulier / une personne physique.'),
        personne_morale: Joi.object({
          raison_sociale: Joi.string().trim()
            .description('Raison sociale telle que renseignée sur le KBIS de l\'entreprise.'),
          siren: Joi.string().pattern(SIREN_REGEX).default(SIREN_FOR_ASSOCIATION)
            .description('Numéro de SIREN tel que renseigné sur le KBIS de l\'entreprise. Si vous êtes une personne morale sans SIREN, ne le remplissez pas.'),
        }).description('Remplir cette partie UNIQUEMENT si le véhicule appartient à une personne morale.'),
      }),
      // @todo: how to display custom error
      plaque_immatriculation: Joi.string().pattern(PLAQUE_REGEX).required()
        .description('Numéro d\'immatriculation tel que renseigné sur le certificat d\'immatriculation.'),
      // @todo: how to display custom error
      numero_formule: Joi.string().pattern(NUMERO_FORMULE_REGEX)
        .description('Numéro de formule tel que renseigné sur le certificat d\'immatriculation. Remplir UNIQUEMENT si le véhicule possède une plaque au format SIV.'),
      date_emission_certificat_immatriculation: Joi.date()
        .description('Date d\'émission du certificat d\'immatriculation telle que renseignée sur le certificat d\'immatriculation. Remplir UNIQUEMENT si le véhicule possède une plaque au format FNI.'),
    }),
  }),
  options: Joi.object({
    controles_techniques: Joi.boolean()
      .description('Récupérer les contrôles techniques du véhicule dans le rapport. Non par défaut.'),
  }),
}).label('Report_by_data_payload')

export default generateReportRoute({ path: '/report-by-data', logLabel: 'PUBLIC_ROUTE_REPORT_BY_DATA', payloadSchema: reportByDataPayloadSchema })
