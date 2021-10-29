import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'

import HapiSwagger from 'hapi-swagger'
import Joi from 'joi'

import { sendContact } from './handlers/feedback.js'
import { NUMERO_FORMULE_REGEX, NUMERO_IMMATRICULATION_REGEX, SIREN_REGEX, VERSION_REGEX } from './constant/regex.js'
import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from './constant/type.js'

import config from './config.js'


const PORT = Number(config.port) || 8000
const BASE_PRIVATE_URL = '/private'
const PRIVATE_API_REPORT_PATH = '/report'

const prefixize = (route) => {
  return {
    ...route,
    path: config.apiPrefix + route.path
  }
}

const routes = [
  {
    method: 'GET',
    path:'/version',
    options: {
      tags: ['api'],  // add to swagger documentation

      // hapi options
      response: {
        schema: Joi.object({
          version: Joi.string().pattern(VERSION_REGEX)
            .description('Version du backend'),
        }).label('VersionReponse'),
      }
    },
    handler: (request, h) => {
      return { version: config.version }
    },
  },
  {
    method: 'GET',
    path:'/health',
    // Not in documentation : for internal use only
    handler: (request, h) => {
      return { status: 'ok' }
    },
  },
  {
    method: 'POST',
    path:'/contact',
    options: {
      validate: {
        payload: Joi.object({
          browser: Joi.object({
            name: Joi.string().required(),
            os: Joi.string().required(),
            type: Joi.string().required(),
            version: Joi.string().required(),
          }).required()
            .description('Données techniques qualifiant le navigateur web utilisé par l\'usager'),
          date: Joi.date().iso().required()
            .description('Date d\'envoi du message'),
          email: Joi.string().email().required()
            .description('Adresse email de l\'usager'),
          holder: Joi.boolean().allow('').required()
            .description('L\'usager est-il propriétaire du véhicule ?'),
          identity: Joi.object({
            dateCertificat: Joi.date().iso().allow('')
              .description('Date d\'émission du certificat d\'immatriculation du véhicule (pour les véhicules FNI : immatriculés avant 2009)'),
            formule: Joi.string().allow('').pattern(NUMERO_FORMULE_REGEX)
              .description('Numéro de formule du certificat d\immatriculation du véhicule (pour les véhicules SIV : immatriculés à partir de 2009)'),
            nom: Joi.string().allow('').trim()
              .description('Nom du propriétaire du véhicule'),
            plaque: Joi.string().allow('').pattern(NUMERO_IMMATRICULATION_REGEX)
              .description('Numéro d\'immatriculation du véhicule'),
            prenoms: Joi.string().allow('').trim()
              .description('Prénoms du propriétaire du véhicule'),
            raisonSociale: Joi.string().allow('').trim()
              .description('Raison sociale de la société propriétaire du véhicule'),
            siren: Joi.string().allow('').pattern(SIREN_REGEX)
              .description('Numéro de SIREN de la société propriétaire du véhicule'),
            typeImmatriculation: Joi.string().uppercase().allow('').valid(...Object.values(TYPE_IMMATRICULATION))
              .description('Type d\'immatriculation du véhicule (FNI pour les véhicules immatriculés avant 2009, SIV pour les autres)'),
            typePersonne: Joi.string().uppercase().allow('').valid(...Object.values(TYPE_PERSONNE))
              .description('Type de propriétaire du véhicule'),
          }),
          message: Joi.string().allow('').trim()
            .description('Message envoyé par l\'usager'),
          subject: Joi.string().required()
            .description('Sujet de la demande envoyée par l\'usager'),
          uuid: Joi.string().guid({
            version: [
              'uuidv4'
            ]
          }).required()
            .description('Identifiant anonyme (pour réaliser des statistiques métier)')
        }).label('ContactPayload'),
      },
    },
    handler: sendContact,
  }
]

export const createServer = async () => {
  const server = new Hapi.Server({
    host: '0.0.0.0',
    port: PORT,
  })

  // load & register plugins
  const plugins = [
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: config.isPublicApi ? 'Api grand publique HistoVec' : 'Api HistoVec',
          version: config.version,
        },
        cors: true,  // Enable cors for api.gouv.fr (and all origins because hapi-swagger dont let us choose specific origins)
      }
    }
  ]

  plugins.push({
    plugin: await import('./plugins/private-api'),
    options: {
      // Custom options
      apiPrefix: config.apiPrefix,
      basePrivateUrl: BASE_PRIVATE_URL,
      private: config.isPublicApi,
    },
  })


  if (config.isPublicApi) {
    // @todo: s'assurer que le swagger ne soit pas accessible en PROD pour l'api backend classique

    plugins.push({
      plugin: await import('./plugins/public-api'),
      options: {
        // hapi-swagger options
        definitionPrefix: 'useLabel',
        reuseDefinitions: false,

        // Custom options
        apiPrefix: config.apiPrefix,
        basePrivateUrl: BASE_PRIVATE_URL,
        privateApiReportPath: PRIVATE_API_REPORT_PATH,
      },
    })
  }

  await server.register(plugins)

  // Static routes
  server.route(routes.map(prefixize))

  return server
}
