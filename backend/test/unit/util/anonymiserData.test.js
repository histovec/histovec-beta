import { expect } from '@hapi/code'
import Lab from '@hapi/lab'
import {
  anonymize,
  anonymizeText,
  anonymizedControlesTechniques,
  anonymizeIdentite
} from '../../../src/util/anonymiserData.js'
import { CONTROL_TECHNIQUES_MOCK_FOR_BPSA } from '../../../src/constant/utac.js';

export const lab = Lab.script()

lab.experiment('anonymisation des immatriculations et vins', () => {
  lab.test('immatriculation', () => {
    const immatAnonymize = anonymize('AA-123-BB')
    expect(immatAnonymize).to.equal('AA*****BB')
  })
  lab.test('vin par défaut', () => {
    const vinAnonymize = anonymize('2013BZ80335')
    expect(vinAnonymize).to.equal('20*******35')
  })
  lab.test('vin avec un chiffre visible', () => {
    const vinAnonymize = anonymize('2013BZ80335', 1)
    expect(vinAnonymize).to.equal('2*********5')
  })
  lab.test('vin avec trois chiffres visibles', () => {
    const vinAnonymize = anonymize('2013BZ80335', 3)
    expect(vinAnonymize).to.equal('201*****335')
  })
  lab.test('vin avec quatre chiffres visibles', () => {
    const vinAnonymize = anonymize('2013BZ80335', 4)
    expect(vinAnonymize).to.equal('2013***0335')
  })
});

lab.experiment('anonymisation des prénoms', () => {
  lab.test('prénom court', () => {
    const prenomAnonymize = anonymizeText('Zoe')
    expect(prenomAnonymize).to.equal('Z**')
  })
  lab.test('prénom moyen', () => {
    const prenomAnonymize = anonymizeText('Julien')
    expect(prenomAnonymize).to.equal('J*****')
  })
  lab.test('prénom long', () => {
    const prenomAnonymize = anonymizeText('Alexandre')
    expect(prenomAnonymize).to.equal('A********')
  })
});

lab.experiment('anonymisation controle technique', () => {
  lab.test('controle technique', () => {
    const freshUtacData = {
      ct: CONTROL_TECHNIQUES_MOCK_FOR_BPSA.ct,
      ctUpdateDate: CONTROL_TECHNIQUES_MOCK_FOR_BPSA.update_date,
    }
    const freshUtacDataAnonymize = anonymizedControlesTechniques(freshUtacData)

    const freshUtacDataResultat = {
      ct: [
        {
          ct_id: 1,
          ct_pv: null,
          ct_centre: null,
          ct_date: '11/12/2014',
          ct_deb: null,
          ct_fin: null,
          ct_nature: 'VTP',
          ct_resultat: 'A',
          ct_km: 98429,
          ct_immat: 'AW*****TD',
          ct_vin: 'VF7***********672',
        },
        {
          ct_id: 2,
          ct_pv: null,
          ct_centre: null,
          ct_date: '10/12/2016',
          ct_deb: null,
          ct_fin: null,
          ct_nature: 'VTP',
          ct_resultat: 'A',
          ct_km: 132874,
          ct_immat: 'DN*****AG',
          ct_vin: 'VF7***********672',
        },
        {
          ct_id: 3,
          ct_pv: null,
          ct_centre: null,
          ct_date: '26/12/2018',
          ct_deb: null,
          ct_fin: null,
          ct_nature: 'VTP',
          ct_resultat: 'A',
          ct_km: 160532,
          ct_immat: 'DN*****AG',
          ct_vin: 'VF7***********672',
        },
      ],
      ctUpdateDate: '01/08/2021',
    }

    expect(freshUtacDataAnonymize).to.equal(freshUtacDataResultat)
  })
});

lab.experiment('anonymisation identité', () => {
  lab.test('propriétaire siv particulier', () => {
    const identite = {
      alreadyHasIdAndKey: false,
      typeImmatriculation: 'SIV',
      prenoms: ['Alexandre'],
      nom: 'Roullier',
      numeroImmatriculation: 'CT-130-GS',
      numeroFormule: '2010DE35934'
    }
    const anonymizedIdentite = anonymizeIdentite(identite)

    const anonymizedIdentiteResultat = {
      anonymizedDataIdentite: {
        alreadyHasIdAndKey: false,
        anonymizedNom: 'R*******',
        anonymizedPrenom: 'A********',
        anonymizedRaisonSociale: undefined,
        anonymizedSiren: undefined,
        dateEmissionCertificatImmatriculation: undefined,
        id: undefined,
        key: undefined,
        anonymizedNumeroImmatriculation: 'C********',
        anonymizedNumeroFormule: '2**********',
        typeImmatriculation: 'SIV',
        typePersonne: 'PARTICULIER'
      }
    }
    expect(anonymizedIdentite).to.equal(anonymizedIdentiteResultat)
  })
  lab.test('propriétaire siv professionel', () => {
    const identite = {
      alreadyHasIdAndKey: false,
      typeImmatriculation: 'SIV',
      raisonSociale: 'SARL JAMES INTERNATIONAL',
      siren: '351222856',
      numeroImmatriculation: 'AY-393-JZ',
      numeroFormule: '2009AP21452'
    }
    const anonymizedIdentite = anonymizeIdentite(identite)

    const anonymizedIdentiteResultat = {
      anonymizedDataIdentite: {
        alreadyHasIdAndKey: false,
        anonymizedNom: undefined,
        anonymizedPrenom: undefined,
        anonymizedRaisonSociale: 'S*** J**** I************',
        anonymizedSiren: '3********',
        anonymizedNumeroImmatriculation: 'A********',
        anonymizedNumeroFormule: '2**********',
        dateEmissionCertificatImmatriculation: undefined,
        id: undefined,
        key: undefined,
        typeImmatriculation: 'SIV',
        typePersonne: 'PRO'
      }
    }
    expect(anonymizedIdentite).to.equal(anonymizedIdentiteResultat)
  })
  lab.test('propriétaire fni particulier', () => {
    const identite = {
      alreadyHasIdAndKey: false,
      typeImmatriculation: 'FNI',
      nom: 'aaaa bbbbbbb',
      prenoms: [''],
      numeroImmatriculation: '123-ABC-45',
      dateEmissionCertificatImmatriculation: '2020-12-31T00:00:00.000Z'
    }
    const anonymizedIdentite = anonymizeIdentite(identite)

    const anonymizedIdentiteResultat = {
      anonymizedDataIdentite: {
        alreadyHasIdAndKey: false,
        anonymizedNom: 'a*** b******',
        anonymizedPrenom: undefined,
        anonymizedRaisonSociale: undefined,
        anonymizedSiren: undefined,
        anonymizedNumeroImmatriculation: '1*********',
        anonymizedNumeroFormule: undefined,
        dateEmissionCertificatImmatriculation: '2020-12-31T00:00:00.000Z',
        id: undefined,
        key: undefined,
        typeImmatriculation: 'FNI',
        typePersonne: 'PARTICULIER'
      }
    }
    expect(anonymizedIdentite).to.equal(anonymizedIdentiteResultat)
  })
  lab.test('propriétaire fni professionel', () => {
    const identite = {
      alreadyHasIdAndKey: false,
      raisonSociale: 'SARL JAMES INTERNATIONAL',
      siren: '351222856',
      typeImmatriculation: 'FNI',
      numeroImmatriculation: '123-ABC-45',
      dateEmissionCertificatImmatriculation: '2020-12-31T00:00:00.000Z'
    }
    const anonymizedIdentite = anonymizeIdentite(identite)

    const anonymizedIdentiteResultat = {
      anonymizedDataIdentite: {
        alreadyHasIdAndKey: false,
        anonymizedNom: undefined,
        anonymizedPrenom: undefined,
        anonymizedRaisonSociale: 'S*** J**** I************',
        anonymizedSiren: '3********',
        dateEmissionCertificatImmatriculation: '2020-12-31T00:00:00.000Z',
        id: undefined,
        key: undefined,
        anonymizedNumeroImmatriculation: '1*********',
        anonymizedNumeroFormule: undefined,
        typeImmatriculation: 'FNI',
        typePersonne: 'PRO'
      }
    }
    expect(anonymizedIdentite).to.equal(anonymizedIdentiteResultat)
  })
  lab.test('acheteur', () => {
    const identite = {
      id: 'mSTuwjaaNoz2ar5qfEffrTs+zn0E/fZAq+5SCEnIM4U=',
      key: '7hlYY6JMJ3bNu8nZx48LTv6wYa/r+hmcoEEFYWK/b+k=',
      logLabel: 'PUBLIC_ROUTE_REPORT_BY_CODE',
      alreadyHasIdAndKey: true,
      typeImmatriculation: 'SIV'
    }
    const anonymizedIdentite = anonymizeIdentite(identite)

    const anonymizedIdentiteResultat = {
      anonymizedDataIdentite: {
        alreadyHasIdAndKey: true,
        anonymizedNom: undefined,
        anonymizedPrenom: undefined,
        anonymizedRaisonSociale: undefined,
        anonymizedSiren: undefined,
        anonymizedNumeroImmatriculation: undefined,
        anonymizedNumeroFormule: undefined,
        dateEmissionCertificatImmatriculation: undefined,
        id: 'mSTuwjaaNoz2ar5qfEffrTs+zn0E/fZAq+5SCEnIM4U=',
        key: '7hlYY6JMJ3bNu8nZx48LTv6wYa/r+hmcoEEFYWK/b+k=',
        typeImmatriculation: 'SIV',
        typePersonne: 'PRO'
      }
    }
    expect(anonymizedIdentite).to.equal(anonymizedIdentiteResultat)
  })
});
