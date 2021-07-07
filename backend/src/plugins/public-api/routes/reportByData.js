import Joi from 'joi'
import Boom from '@hapi/boom'

import { appLogger, syslogLogger } from '../../../util/logger.js'
import { decryptJson, hash, urlSafeBase64Encode, urlSafeBase64Decode } from '../../../util/crypto.js'
import { getDepartement } from '../../../util/codePostal.js'
import { buildReportId, buildReportKey } from '../util/report.js'
import { normalizeReport, normalizeControlesTechniques } from '../util/normalizeData.js'
import { vehiculeMapping, controlesTechniquesMapping } from '../util/mapping.js'
import { processControlesTechniques } from '../../../util/controlesTechniques.js'
import { reportResponseSchema } from '../../schemas/report.js'

import { NUMERO_FORMULE_REGEX, PLAQUE_REGEX, PLAQUE_FNI_REGEX, PLAQUE_SIV_REGEX, RAISON_SOCIALE_REGEX, SIREN_REGEX } from '../../../constant/regex.js'
import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '../../../constant/type.js'

import config from '../../../config.js'


const PUBLIC_API_REPORT_BY_DATA_PATH = '/report-by-data'

const TITULAIRE_PATH = 'vehicule.titulaire'
const TITULAIRE_PARTICULIER_PATH = 'vehicule.titulaire.particulier'
const NOM = `${TITULAIRE_PARTICULIER_PATH}.nom`
const PRENOMS = `${TITULAIRE_PARTICULIER_PATH}.prenoms`
const TITULAIRE_PERSONNE_MORALE_PATH = 'vehicule.titulaire.personne_morale'
const RAISON_SOCIALE = `${TITULAIRE_PERSONNE_MORALE_PATH}.raison_sociale`
const SIREN = `${TITULAIRE_PERSONNE_MORALE_PATH}.siren`

const CERTIFICAT_IMMATRICULATION_PATH = 'vehicule.certificat_immatriculation'
const PLAQUE_IMMATRICULATION = `${CERTIFICAT_IMMATRICULATION_PATH}.plaque_immatriculation`
const NUMERO_FORMULE = `${CERTIFICAT_IMMATRICULATION_PATH}.numero_formule`
const DATE_EMISSION_CERTIFICAT_IMMATRICULATION = `${CERTIFICAT_IMMATRICULATION_PATH}.date_emission_certificat_immatriculation`

const PUBLIC_ROUTE_REPORT_BY_DATA = 'PUBLIC_ROUTE_REPORT_BY_DATA'


const checkPayload = ({ nom, prenoms, raisonSociale, siren, plaqueImmatriculation, numeroFormule, dateEmissionCertificatImmatriculation }) => {
  const hasPrenoms = prenoms?.length > 0

  if (!nom && !hasPrenoms && !raisonSociale && !siren) {
    throw Boom.badRequest(
      `Vous n'avez fourni aucune information concernant le titulaire du véhicule.
      Si vous souhaitez interroger un véhicule particulier, vous devez fournir les 2 champs '${NOM}' et '${PRENOMS}'.
      Si vous souhaitez interroger un véhicule de société, vous devez fournir les 2 champs '${RAISON_SOCIALE}' et '${SIREN}'.`
    )
  }

  const vehiculeProReminder = (
    `Si vous souhaitez interroger un véhicule de société, fournissez les 2 champs '${RAISON_SOCIALE}' et '${SIREN}' SANS fournir les champs '${NOM}' et '${PRENOMS}'.`
  )

  if (hasPrenoms && !nom) {
    throw Boom.badRequest(
      `Vous avez fourni le champ '${PRENOMS}', vous souhaitez donc interroger un véhicule particulier.
      Les 2 champs '${NOM}' et '${PRENOMS}' doivent être renseignés pour interroger un véhicule particulier.
      ${vehiculeProReminder}`
    )
  }

  if (nom && !hasPrenoms) {
    throw Boom.badRequest(
      `Vous avez fourni le champ '${NOM}', vous souhaitez donc interroger un véhicule particulier.
      Les 2 champs '${NOM}' et '${PRENOMS}' doivent être renseignés pour interroger un véhicule particulier.
      ${vehiculeProReminder}`
    )
  }

  const vehiculeParticulierReminder = (
    `Si vous souhaitez interroger un véhicule particulier, fournissez les 2 champs '${NOM}' et '${PRENOMS}' SANS fournir les champs '${RAISON_SOCIALE}' et '${SIREN}'.`
  )

  if (siren && !raisonSociale) {
    throw Boom.badRequest(
      `Vous avez fourni le champ '${SIREN}', vous souhaitez donc interroger un véhicule de société.
      Les 2 champs '${RAISON_SOCIALE}' et '${SIREN}' doivent être renseignés pour interroger un véhicule de société.
      ${vehiculeParticulierReminder}`
    )
  }

  if (raisonSociale && !siren) {
    throw Boom.badRequest(
      `Vous avez fourni le champ '${RAISON_SOCIALE}', vous souhaitez donc interroger un véhicule de société.
      Les 2 champs '${RAISON_SOCIALE}' et '${SIREN}' doivent être renseignés pour interroger un véhicule de société.
      ${vehiculeParticulierReminder}`
    )
  }

  if (!plaqueImmatriculation) {
    throw Boom.badRequest(`Le champ '${PLAQUE_IMMATRICULATION}' est obligatoire et doit être au format SIV (${PLAQUE_SIV_REGEX}) ou FNI (${PLAQUE_FNI_REGEX}).`)
  }

  if (PLAQUE_SIV_REGEX.test(plaqueImmatriculation) && !numeroFormule) {
    throw Boom.badRequest(`Le champ '${NUMERO_FORMULE}' est obligatoire pour un véhicule SIV.`)
  }

  if (PLAQUE_FNI_REGEX.test(plaqueImmatriculation) && !dateEmissionCertificatImmatriculation) {
    throw Boom.badRequest(`Le champ '${DATE_EMISSION_CERTIFICAT_IMMATRICULATION}' est obligatoire pour un véhicule FNI.`)
  }
}

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
          siren: Joi.string().pattern(SIREN_REGEX),
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


export default {
  method: 'POST',
  path: PUBLIC_API_REPORT_BY_DATA_PATH,
  options: {
    tags: ['api'],
    validate: {
      payload: reportByDataPayloadSchema,
    },
    response: {
      schema: reportResponseSchema,
    }
  },
  handler: async (request, h) => {
    const {
      vehicule: {
        certificat_immatriculation: {
          titulaire: {
            particulier: {
              nom,
              prenoms,
            } = {},
            personne_morale: {
              raison_sociale: raisonSociale,
              siren,
            } = {},
          } = {},
          plaque_immatriculation: plaqueImmatriculation,
          date_emission_certificat_immatriculation: dateEmissionCertificatImmatriculation,
          numero_formule: numeroFormule,
        },
      },
      options: {
        controles_techniques: askTechnicalControls,
      } = {},
    } = request.payload

    // As far as I know, Joi don't permit to validate as needed in this custom function
    checkPayload({ nom, prenoms, raisonSociale, siren, plaqueImmatriculation, numeroFormule, dateEmissionCertificatImmatriculation })

    syslogLogger.debug({ key: 'payload', tag: PUBLIC_ROUTE_REPORT_BY_DATA, value: { nom, prenoms, raisonSociale, siren, plaqueImmatriculation, numeroFormule, dateEmissionCertificatImmatriculation } })

    const typeImmatriculation = PLAQUE_SIV_REGEX.test(plaqueImmatriculation) ? TYPE_IMMATRICULATION.SIV : TYPE_IMMATRICULATION.FNI
    const typePersonne = nom ? TYPE_PERSONNE.PARTICULIER : TYPE_PERSONNE.PRO

    const reportId = buildReportId(
      { nom, prenoms, raisonSociale, siren, plaqueImmatriculation, numeroFormule, dateEmissionCertificatImmatriculation },
      { typeImmatriculation, typePersonne }
    )
    const urlSafeBase64EncodedReportId = urlSafeBase64Encode(reportId)

    const { privateApiReportUrl } = request.server.plugins.publicApi

    const { result: { sivData, utacData, utacDataKey } } = await request.server.inject({
      method: 'POST',
      url: privateApiReportUrl,
      payload: {
        id: urlSafeBase64EncodedReportId,
        uuid: config.apiUuid,
        options: {
          ignoreTechnicalControls: !askTechnicalControls,
        },
      },
      allowInternals: true,
    })

    syslogLogger.debug({ key: 'encrypted_raw_report', tag: PUBLIC_ROUTE_REPORT_BY_DATA, value: { sivData, utacData, utacDataKey } })

    const reportKey = buildReportKey(
      { plaqueImmatriculation, numeroFormule, dateEmissionCertificatImmatriculation },
      { typeImmatriculation }
    )

    const report = decryptJson(sivData, reportKey)

    syslogLogger.debug({ key: 'decrypted_raw_report', tag: PUBLIC_ROUTE_REPORT_BY_DATA, value: { ...report } })

    const normalizedReport = normalizeReport(report)
    syslogLogger.debug({ key: 'normalized_report', tag: PUBLIC_ROUTE_REPORT_BY_DATA, value: { ...normalizedReport } })

    const {
      adr_code_postal_tit = '',
      age_certificat,
      couleur,
      CTEC_RLIB_ENERGIE,
      CTEC_RLIB_CATEGORIE,
      CTEC_RLIB_GENRE,
      date_premiere_immat,
      is_apte_a_circuler,
      is_fni,
      marque,
      nom_commercial,
      nb_titulaires,
      tvv,
    } = report

    const departement = adr_code_postal_tit ? getDepartement(adr_code_postal_tit) : undefined
    const anonymizedReportId = urlSafeBase64Encode(hash(urlSafeBase64EncodedReportId))

    appLogger.info(`[Demande] ${anonymizedReportId} age_certificat ${age_certificat}`)
    appLogger.info(`[Demande] ${anonymizedReportId} couleur ${couleur}`)
    appLogger.info(`[Demande] ${anonymizedReportId} CTEC_RLIB_ENERGIE ${CTEC_RLIB_ENERGIE}`)
    appLogger.info(`[Demande] ${anonymizedReportId} CTEC_RLIB_CATEGORIE ${CTEC_RLIB_CATEGORIE}`)
    appLogger.info(`[Demande] ${anonymizedReportId} CTEC_RLIB_GENRE ${CTEC_RLIB_GENRE}`)
    appLogger.info(`[Demande] ${anonymizedReportId} date_premiere_immat ${date_premiere_immat}`)
    appLogger.info(`[Demande] ${anonymizedReportId} departement ${departement}`)
    appLogger.info(`[Demande] ${anonymizedReportId} is_apte_a_circuler ${is_apte_a_circuler}`)
    appLogger.info(`[Demande] ${anonymizedReportId} is_fni ${is_fni}`)
    appLogger.info(`[Demande] ${anonymizedReportId} marque ${marque}`)
    appLogger.info(`[Demande] ${anonymizedReportId} nom_commercial ${nom_commercial}`)
    appLogger.info(`[Demande] ${anonymizedReportId} nb_titulaires ${nb_titulaires}`)
    appLogger.info(`[Demande] ${anonymizedReportId} tvv ${tvv}`)

    const mappedVehicule = vehiculeMapping(normalizedReport)
    syslogLogger.debug({ key: 'mapped_report', tag: PUBLIC_ROUTE_REPORT_BY_DATA, value: { ...mappedVehicule } })

    if (!askTechnicalControls) {
      const reportWithoutControlesTechniques = {
        vehicule: mappedVehicule,
      }

      syslogLogger.debug({ key: 'report_with_controles_techniques', tag: PUBLIC_ROUTE_REPORT_BY_DATA, value: { ...reportWithoutControlesTechniques } })

      return reportWithoutControlesTechniques
    }

    const rawUtacDataKey = urlSafeBase64Decode(utacDataKey)
    const rawControlesTechniques = decryptJson(utacData, rawUtacDataKey)
    syslogLogger.debug({ key: 'raw_controles_techniques', tag: PUBLIC_ROUTE_REPORT_BY_DATA, value: { ...rawControlesTechniques } })

    const normalizedControlesTechniques = normalizeControlesTechniques(rawControlesTechniques)
    syslogLogger.debug({ key: 'normalized_controles_techniques', tag: PUBLIC_ROUTE_REPORT_BY_DATA, value: { ...normalizedControlesTechniques } })

    const labeledControlesTechniques = processControlesTechniques(normalizedControlesTechniques)
    syslogLogger.debug({ key: 'labeled_controles_techniques', tag: PUBLIC_ROUTE_REPORT_BY_DATA, value: { ...labeledControlesTechniques } })

    const mappedControlesTechniques = controlesTechniquesMapping(labeledControlesTechniques)
    syslogLogger.debug({ key: 'mapped_controles_techniques', tag: PUBLIC_ROUTE_REPORT_BY_DATA, value: { ...mappedControlesTechniques } })

    // @todo: Add mock mode for UTAC (using:  248 * (100*random - 100/2) formula to simulate time processing)

    // @todo: Add /report/id route (avec idv et key)

    // => Mail Michel : cibles Makefile pour lancer et stopper public-backend + env var

    // @todo: Get swagger.json

    // @todo: BPSA
    // => template files for BPSA (1 file by use case)
    // => CURL samples
    // => swagger file

    const reportWithControlesTechniques = {
      vehicule: mappedVehicule,
      controles_techniques: mappedControlesTechniques,
    }
    syslogLogger.debug({ key: 'report_with_controles_techniques', tag: PUBLIC_ROUTE_REPORT_BY_DATA, value: { ...reportWithControlesTechniques } })

    return reportWithControlesTechniques
  },
}
