import Boom from '@hapi/boom'
import { hashHexdigest } from '../../../util/crypto.js'
import { syslogLogger } from '../../../util/logger.js'
import { apiDataResponseSchema } from '../routes/schemas/apiDataResponseSchema.js'

export const verificationStatus = (status, uuid) => {
  if (status === 204) {
    syslogLogger.info({ key: 'vehicule_non_accessible_code_204', tag: 'API_DATA', uuid })
    throw Boom.notFound('Véhicule introuvable.')
  }
  if (status !== 200) {
    syslogLogger.error({ key: 'vehicule_non_accessible_code_autre_que_200', tag: 'API_DATA', uuid, value: { status } })
    throw Boom.serverUnavailable('Service indisponible.')
  }

  return true
}

export const verificationFormat = (payload, uuid) => {
  const { error } = apiDataResponseSchema.validate(payload)

  if (error) {
    syslogLogger.error({ key: 'format_reponse_api_data_erreur', tag: 'API_DATA', uuid, value: { error_message: error.details[0].message } })
    throw Boom.badGateway('Un problème est survenu lors de la récupération des informations.')
  }

  return true
}

export const verificationImmatriculation = (payload, uuid) => {
  if (hashHexdigest(payload.incoming_query.immat) !== payload.plaq_immat_hash) {
    syslogLogger.error({ key: 'plaque_immatriculation_incorrecte', tag: 'API_DATA', uuid })
    throw Boom.preconditionFailed('Un problème est survenu lors de la récupération des informations.')
  }

  return true
}

export const verificationControleTechnique = (payload, uuid) => {
  const controlesTechniques = payload.vehicule.controles_techniques
  const immatriculation = payload.incoming_query.immat
  let controlesTechniquesValides = true

  if (controlesTechniques && controlesTechniques.length > 0) {
    controlesTechniques.map(controleTechnique => {
      if (controleTechnique.ct_immat !== immatriculation) {
        syslogLogger.info({ key: 'controles_techniques_different', tag: 'API_DATA', uuid, value: { immatriculation_erreur: controleTechnique.ct_immat } })
        controlesTechniquesValides = false

        return false
      }

      return true
    })
  } else {
    syslogLogger.info({ key: 'controles_techniques_manquants', tag: 'API_DATA', uuid })
    return false
  }

  return controlesTechniquesValides
}

export const verificationVehiculeVole = (payload, uuid) => {
  if (payload && payload.vehicule && payload.vehicule.situation_admin && payload.vehicule.situation_admin.is_veh_vole) {
    if (payload.vehicule.situation_admin.is_veh_vole) {
      syslogLogger.info({ key: 'vehicule_vole', tag: 'API_DATA', uuid })
      return true
    }
  } else {
    syslogLogger.info({ key: 'vehicule_vole_imformation_manquante', tag: 'API_DATA', uuid })
  }

  return false
}

export const verificationsData = (response, uuid) => {
  const statusValide = verificationStatus(response.status, uuid)
  const formatValide = verificationFormat(response.payload, uuid)
  const immatriculationValide = verificationImmatriculation(response.payload, uuid)
  const controleTechniqueValide = verificationControleTechnique(response.payload, uuid)
  const vehiculeVole = verificationVehiculeVole(response.payload, uuid)

  return { statusValide, formatValide, immatriculationValide, controleTechniqueValide, vehiculeVole }
}
