import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'

import HapiSwagger from 'hapi-swagger'
import Joi from 'joi'

import { sendContact } from './handlers/feedback.js'
import { NUMERO_FORMULE_REGEX, PLAQUE_REGEX, SIREN_REGEX, VERSION_REGEX } from './constant/regex.js'
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
      response: {
        schema: Joi.object({
          version: Joi.string().pattern(VERSION_REGEX)
            .description('Version du backend'),
        }),
      }
    },
    handler: (request, h) => {
      return { version: config.version }
    },
  },
  {
    method: 'GET',
    path:'/health',
    handler: (request, h) => {
      return { status: 'ok' }
    },
  },
  {
    method: 'POST',
    path:'/contact',
    // description: 'Envoi de mail au support d\'HistoVec',
    options: {
      validate: {
        payload: Joi.object({
          uuid: Joi.string().guid({
            version: [
              'uuidv4'
            ]
          }).required()
            .description('Identifiant anonyme (pour réaliser des statistiques métier)'),
          email: Joi.string().email().required()
            .description('Adresse email de l\'usager'),
          message: Joi.string().trim()
            .description('Message envoyé par l\'usager'),
          date: Joi.date().iso().required()
            .description('Date d\'envoi du message'),
          holder: Joi.boolean().required()
            .description('L\'usager est-il propriétaire du véhicule ?'),
          browser: Joi.object({
            name: Joi.string().required(),
            version: Joi.string().required(),
            os: Joi.string().required(),
            type: Joi.string().required(),
          }).required()
            .description('Données techniques qualifiant le navigateur web utilisé par l\'usager'),
          subject: Joi.string().required()
            .description('Sujet de la demande envoyée par l\'usager'),
          identity: Joi.object({
            typeImmatriculation: Joi.string().valid(TYPE_IMMATRICULATION.SIV).insensitive()
              .description('Type d\'immatriculation du véhicule (FNI pour les véhicules immatriculés avant 2009, SIV pour les autres)'),
            typePersonne: Joi.string().valid(TYPE_PERSONNE.PRO).insensitive()
              .description('Type de propriétaire du véhicule'),
            raisonSociale: Joi.string().trim()
              .description('Raison sociale de la société propriétaire du véhicule'),
            siren: Joi.string().pattern(SIREN_REGEX)
              .description('Numéro de SIREN de la société propriétaire du véhicule'),
            nom: Joi.string().trim()
              .description('Nom du propriétaire du véhicule'),
            prenom: Joi.string().trim()  // @todo use prenoms instead of prenom
              .description('Prénoms du propriétaire du véhicule'),
            plaque: Joi.string().pattern(PLAQUE_REGEX)
              .description('Plaque d\'immatriculation du véhicule'),
            formule: Joi.string().pattern(NUMERO_FORMULE_REGEX)
              .description('Numéro de formule du certificat d\immatriculation du véhicule (pour les véhicules SIV : immatriculés à partir de 2009)'),
            dateCertificat: Joi.date().iso()
              .description('Date d\'émission du certificat d\'immatriculation du véhicule (pour les véhicules FNI : immatriculés avant 2009)'),
          })
        }),
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

  // Static routes
  server.route(routes.map(prefixize))

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
      }
    }
  ]

  plugins.push({
    plugin: await import('./plugins/private-api'),
    options: {
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
        apiPrefix: config.apiPrefix,
        basePrivateUrl: BASE_PRIVATE_URL,
        privateApiReportPath: PRIVATE_API_REPORT_PATH,
      },
    })
  }

  await server.register(plugins)

  return server
}
