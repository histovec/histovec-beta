import Boom from '@hapi/boom'
import { appLogger } from '../../../../util/logger.js'

const TITULAIRE_PARTICULIER_PATH = 'vehicule.titulaire.particulier'
const NOM = `${TITULAIRE_PARTICULIER_PATH}.nom`
const PRENOMS = `${TITULAIRE_PARTICULIER_PATH}.prenoms`
const TITULAIRE_PERSONNE_MORALE_PATH = 'vehicule.titulaire.personne_morale'
const RAISON_SOCIALE = `${TITULAIRE_PERSONNE_MORALE_PATH}.raison_sociale`
const SIREN = `${TITULAIRE_PERSONNE_MORALE_PATH}.siren`

export const checkPayload = ({ nom, prenoms, raisonSociale, siren, numeroImmatriculation, numeroFormule, dateEmissionCertificatImmatriculation }) => {
  const hasPrenoms = prenoms?.length > 0

  if (!nom && !hasPrenoms && !raisonSociale && !siren) {
    appLogger.info(
      `Vous n'avez fourni aucune information concernant le titulaire du véhicule.
      Si vous souhaitez interroger un véhicule particulier, vous devez fournir les 2 champs '${NOM}' et '${PRENOMS}'.
      Si vous souhaitez interroger un véhicule de société, vous devez fournir les 2 champs '${RAISON_SOCIALE}' et '${SIREN}'.`,
    )

    throw Boom.badRequest()
  }

  const vehiculeParticulierReminder = (
    `Si vous souhaitez interroger un véhicule particulier, fournissez les 2 champs '${NOM}' et '${PRENOMS}' SANS fournir les champs '${RAISON_SOCIALE}' et '${SIREN}'.`
  )

  if (siren && !raisonSociale) {
    appLogger.info(
      `Vous avez fourni le champ '${SIREN}', vous souhaitez donc interroger un véhicule de société.
      Les 2 champs '${RAISON_SOCIALE}' et '${SIREN}' doivent être renseignés pour interroger un véhicule de société.
      ${vehiculeParticulierReminder}`,
    )

    throw Boom.badRequest()
  }

  if (raisonSociale && !siren) {
    appLogger.info(
      `Vous avez fourni le champ '${RAISON_SOCIALE}', vous souhaitez donc interroger un véhicule de société.
      Les 2 champs '${RAISON_SOCIALE}' et '${SIREN}' doivent être renseignés pour interroger un véhicule de société.
      ${vehiculeParticulierReminder}`,
    )

    throw Boom.badRequest()
  }
}
