import { describe, expect, vi, test, beforeAll, afterEach, afterAll } from 'vitest'
import gestionRapportErreur from '@Services/api/gestionRapportErreur'
import router from '@/router/index'

describe('gestionRapportErreur', async () => {
  let spyRouter

  beforeAll(async () => {
    // spy
    spyRouter = vi.spyOn(router, 'push').mockReturnValue('BQ-910-WK2010ES51284')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  test('200', async () => {
    await gestionRapportErreur.redirectionPageErreur(200)

    expect(spyRouter).toHaveBeenCalledTimes(0)
  })

  test('500', async () => {
    await gestionRapportErreur.redirectionPageErreur(500)

    expect(spyRouter).toHaveBeenCalledTimes(1)
    expect(spyRouter).toBeCalledWith({ name: 'erreurInattendue' })
  })

  test('404', async () => {
    await gestionRapportErreur.redirectionPageErreur(404)

    expect(spyRouter).toHaveBeenCalledTimes(1)
    expect(spyRouter).toBeCalledWith({
      name: 'pageNonTrouvee',
      query: {
        errorTitle: 'Ce véhicule est inconnu d\'HistoVec',
        errorMessages: JSON.stringify([
          'Vos noms et prénoms sont susceptibles d\'avoir fait l\'objet d\'erreurs lors de la saisie de votre dossier.',
          'Recopiez exactement les données de votre certificat d\'immatriculation. Le certificat d\'immatriculation que vous utilisez n\'est peut-être pas le dernier en cours de validité (perte, vol, ...).',
        ]),
        primaryAction: JSON.stringify({
          label: 'Revenir au formulaire de recherche',
          icon: 'ri-arrow-right-fill',
          to: '/proprietaire',
        }),
      },
    })
  })

  test('501', async () => {
    await gestionRapportErreur.redirectionPageErreur(501)

    expect(spyRouter).toHaveBeenCalledTimes(1)
    expect(spyRouter).toBeCalledWith({ name: 'serviceIndisponible' })
  })
})

