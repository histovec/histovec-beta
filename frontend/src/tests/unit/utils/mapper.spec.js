import { describe, expect, test } from 'vitest';

import {
  controlesTechniquesMapping,
  historiqueMapping,
  queryMapping,
  titulaireMapping,
  vehiculeMapping,
} from '@Utils/mapping/mapper'
import {
  reponseRequeteApiSivParticulier200,
  reponseRequeteApiIvtParticulier200,
  reponseRequeteApiIvtProfessionnel200,
  reponseSivParticulierFormat200,
  reponseIvtParticulierFormat200,
  reponseIvtProfessionnelFormat200,
} from '@/tests/fixtures/index'

describe('mapper', () => {
  test('doit mapper un historique', () => {
    const historique = [
      {
        date: '28/04/2023',
        type: 'operations de changement immatriculation',
      },
      {
        date: '28/04/2023',
        type: 'plaque immatriculation diplomatique',
      }]
    const historiqueMappe = [
      {
        date: '28/04/2023',
        type: 'operations de changement immatriculation',
      },
      {
        date: '28/04/2023',
        type: 'plaque immatriculation diplomatique',
      }]
    const historiqueMapped = historiqueMapping(historique)

    expect(historiqueMapped).toStrictEqual(historiqueMappe)
  })

  test('doit mapper un historique avec une mauvaise entrée', () => {
    const historique = [
      {
        date: '28/04/2023',
        typa: 'CUMUL_OPERATIONS',
      },
      {
        date: '28/04/2023',
        type: 'IMMAT_DIPLO_DEMANDE',
      }]
    const historiqueMappe = [
      {
        date: '28/04/2023',
        type: undefined,
      },
      {
        date: '28/04/2023',
        type: 'IMMAT_DIPLO_DEMANDE',
      }]
    const historiqueMapped = historiqueMapping(historique)

    expect(historiqueMapped).toStrictEqual(historiqueMappe)
  })

  test('doit mapper le query pour un siv_physique', () => {
    const siv_physique =  {
      nom: 'nom',
      prenom: ['prenom', 'second'],
      immat: 'FM-934-NL',
      numero_formule: 'numero_formujle_phy_siv_query',
    }

    const sivPhysiqueMappe =  {
      nom: 'nom',
      prenom: ['prenom', 'second'],
      immat: 'FM-934-NL',
      numeroFormule: 'numero_formujle_phy_siv_query',
    }
    const querryMapped = queryMapping(siv_physique)

    expect(querryMapped).toStrictEqual(sivPhysiqueMappe)
  })

  test('doit mapper le query pour un siv_morale', () => {
    const siv_morale =  {
      raison_sociale: 'raison_sociale',
      siren: 'siren',
      immat: 'FM-934-NL',
      numero_formule: 'numero_formule',
    }
    const sivMoraleMappe =  {
      raisonSociale: 'raison_sociale',
      siren: 'siren',
      immat: 'FM-934-NL',
      numeroFormule: 'numero_formule',
    }
    const querryMapped = queryMapping(siv_morale)

    expect(querryMapped).toStrictEqual(sivMoraleMappe)
  })

  test('doit mapper le query pour un ivt_physique', () => {
    const ivt_physique =  {
      nom_prenom:'nom_prenom',
      immat:'664RLD75',
      date_emission_ci:'31/05/2023',
    }
    const ivtPhysiqueMappe =  {
      nomPrenom:'nom_prenom',
      immat:'664RLD75',
      dateEmissionCi:'31/05/2023',
    }

    const querryMapped = queryMapping(ivt_physique)

    expect(querryMapped).toStrictEqual(ivtPhysiqueMappe)
  })

  test('doit mapper le query pour un ivt_morale', () => {
    const ivt_morale =  {
      raison_sociale: 'raison_sociale',
      siren: 'siren',
      immat: '664RLD75',
      date_emission_ci: '31/05/2023',
    }

    const ivtMoraleMappe =  {
      raisonSociale: 'raison_sociale',
      siren: 'siren',
      immat: '664RLD75',
      dateEmissionCi: '31/05/2023',
    }
    const querryMapped = queryMapping(ivt_morale)

    expect(querryMapped).toStrictEqual(ivtMoraleMappe)
  })

  test('doit mapper le query pour un report par code', () => {
    const code =  {
      code:'CodePourUnAcheteurPotentiel',
    }

    const querryMapped = queryMapping(code)

    expect(querryMapped).toStrictEqual(code)
  })

  test.skip('doit mapper un particulier', () => {
    // todo remplacer le test avec proprietaireMapping
    const particulierMappe = {
      particulier: {
        nomNaissance: 'nom_naissance',
        prenom: 'prenom',
      },
      codePostal : 12333,
    }

    const particulierMapped = titulaireMapping('nom_naissance', 'prenom', '', '', 12333)

    expect(particulierMapped).toStrictEqual(particulierMappe)
  })

  test.skip('doit mapper une personne morale', () => {
    // todo remplacer le test avec proprietaireMapping
    const personneMoraleMappe = {
      personneMorale: {
        raisonSociale: 'raison_sociale',
        siren: 'siren',
      },
      codePostal : 12333,
    }
    const personneMoraleMapped = titulaireMapping('', '', 'raison_sociale', 'siren', 12333)

    expect(personneMoraleMapped).toStrictEqual(personneMoraleMappe)
  })

  test('doit mapper un controle techniques', () => {
    const controleTechniques = [
      {
        date: '2014-12-11',
        nature: 'VTP',
        resultat: 'A',
        km: 98429,
      },
      {
        date: '2016-12-10',
        nature: 'VTP',
        resultat: 'A',
        km: 132874,
      },
      {
        date: '2018-12-26',
        nature: 'VTP',
        resultat: 'A',
        km: 160532,
      },
    ]
    const controleTechniquesMappe = [
      {
        date: '2014-12-11',
        nature: 'VTP',
        resultat: 'A',
        km: 98429,
      },
      {
        date: '2016-12-10',
        nature: 'VTP',
        resultat: 'A',
        km: 132874,
      },
      {
        date: '2018-12-26',
        nature: 'VTP',
        resultat: 'A',
        km: 160532,
      },
    ]

    const controleTechniquesMapped = controlesTechniquesMapping(controleTechniques)

    expect(controleTechniquesMapped).toStrictEqual(controleTechniquesMappe)
  })

  test('doit mapper la requete pour un siv_physique', () => {
    const requete = reponseRequeteApiSivParticulier200.data

    const requeteMappe = reponseSivParticulierFormat200

    const requeteMapped = vehiculeMapping(requete)

    expect(requeteMapped).toStrictEqual(requeteMappe)
  })

  test('doit mapper la requete pour un ivt_morale', () => {
    const requete = reponseRequeteApiIvtProfessionnel200.data

    const requeteMappe = reponseIvtProfessionnelFormat200

    const requeteMapped = vehiculeMapping(requete)

    expect(requeteMapped).toStrictEqual(requeteMappe)
  })

  test('doit mapper la requete pour un ivt_physique', () => {
    const requete = reponseRequeteApiIvtParticulier200.data

    const requeteMappe = reponseIvtParticulierFormat200

    const requeteMapped = vehiculeMapping(requete)

    expect(requeteMapped).toStrictEqual(requeteMappe)
  })
});
