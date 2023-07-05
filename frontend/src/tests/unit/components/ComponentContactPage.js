import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import CertificatImmatriculationPerduTheme from '@Views/contact/component/CertificatImmatriculationPerduTheme.vue'
import CessionCertificatImmatriculationTheme from '@Views/contact/component/CessionCertificatImmatriculationTheme.vue'
import FormulaireEnvoiMail from '@Views/contact/component/FormulaireEnvoiMail.vue'
import CessionVehiculeTheme from '@Views/contact/component/CessionVehiculeTheme.vue'
import LeverOppositionTheme from '@Views/contact/component/LeverOppositionTheme.vue'
import MauvaiseDonneesPersonnellesTheme from '@Views/contact/component/MauvaiseDonneesPersonnellesTheme.vue'

describe('CertificatImmatriculationPerduTheme', () => {
  it('Doit afficher les démarches a suivre lorsque le certificat est perdu', () => {
    const selectedThemeText = 'REGISTRATION_CARD_LOSS';

    const wrapper = mount(CertificatImmatriculationPerduTheme, { props: {
        selectedThemeText: selectedThemeText,
      } })

    const divStructure = wrapper.findAll('div');
    expect(divStructure.length).toBe(4);

    const divTitre = divStructure[0];
    const h2 = divTitre.find('h2')
    expect(h2.exists()).true;
    expect(h2.classes('fr-h5')).true;
    expect(h2.text()).toBe('Marche à suivre');

    const divDescription = divStructure[2];
    const p = divDescription.find('p')
    expect(p.exists()).true;
    expect(p.text()).toBe('Il convient d\'effectuer les  démarches de déclaration de perte ou de vol du certificat d\'immatriculation  auprès de l\'A​N​T​S (Agence Nationale des Titres Sécurisés).');

  })
})

describe('CessionCertificatImmatriculationTheme', () => {
  it('Doit afficher les démarches a suivre lorsque le certificat est cédée', () => {
    const selectedThemeText = 'REGISTRATION_CARD_CHANGE';

    const wrapper = mount(CessionCertificatImmatriculationTheme, { props: {
        selectedThemeText: selectedThemeText,
      } })

    const divStructure = wrapper.findAll('div');
    expect(divStructure.length).toBe(4);

    const divTitre = divStructure[0];
    const h2 = divTitre.find('h2')
    expect(h2.exists()).true;
    expect(h2.classes('fr-h5')).true;
    expect(h2.text()).toBe('Marche à suivre');

    const divDescription = divStructure[2];
    const p = divDescription.find('p')
    expect(p.exists()).true;
    expect(p.text()).toBe('Il convient d\'effectuer les  démarches de changement de titulaire du certificat d\'immatriculation  auprès de l\'A​N​T​S (Agence Nationale des Titres Sécurisés).');

  })
})

describe('CessionVehiculeTheme', () => {
  it('Doit afficher les démarches a suivre lorsque le vehicule est cédé', () => {
    const selectedThemeText = 'REGISTRATION_CARD_CHANGE';

    const wrapper = mount(CessionVehiculeTheme, { props: {
        selectedThemeText: selectedThemeText,
      } })

    const divStructure = wrapper.findAll('div');
    expect(divStructure.length).toBe(4);

    const divTitre = divStructure[0];
    const h2 = divTitre.find('h2')
    expect(h2.exists()).true;
    expect(h2.classes('fr-h5')).true;
    expect(h2.text()).toBe('Marche à suivre');

    const divDescription = divStructure[2];
    const p = divDescription.find('p')
    expect(p.exists()).true;
    expect(p.text()).toBe('Il convient d\'effectuer les  démarches de déclaration de cession du véhicule  auprès de l\'A​N​T​S (Agence Nationale des Titres Sécurisés).');

  })
})

describe('LeverOppositionTheme', () => {
  it('Doit afficher les démarches a suivre pour lever une opposition', () => {
    const selectedThemeText = 'RESOLVE_PV';

    const wrapper = mount(LeverOppositionTheme, { props: {
        selectedThemeText: selectedThemeText,
      } })

    const divStructure = wrapper.findAll('div');
    expect(divStructure.length).toBe(4);

    const divTitre = divStructure[0];
    const h2 = divTitre.find('h2')
    expect(h2.exists()).true;
    expect(h2.classes('fr-h5')).true;
    expect(h2.text()).toBe('Marche à suivre');

    const divDescription = divStructure[2];
    const p = divDescription.find('p')
    expect(p.exists()).true;
    expect(p.text()).toBe('Il convient de contacter le Centre Amendes Service au 08 21 08 00 31 (appel surtaxé) ou  l\'Agence nationale de traitement automatisé des infractions (A​N​T​A​I) .');

  })
})

describe('MauvaiseDonneesPersonnellesTheme', () => {
  it('Doit afficher les démarches a suivre lorsque les données sont mauvaises ', () => {
    const selectedThemeText = 'PERSONAL_DATA';

    const wrapper = mount(MauvaiseDonneesPersonnellesTheme, { props: {
        selectedThemeText: selectedThemeText,
      } })

    const divStructure = wrapper.findAll('div');
    expect(divStructure.length).toBe(4);

    const divTitre = divStructure[0];
    const h2 = divTitre.find('h2')
    expect(h2.exists()).true;
    expect(h2.classes('fr-h5')).true;
    expect(h2.text()).toBe('Marche à suivre');

    const divDescription = divStructure[2];
    const p = divDescription.find('p')
    expect(p.exists()).true;
    expect(p.text()).toBe('HistoVec vous permet de consulter les données enregistrées dans le SIV (Système d\'Immatriculation des Véhicules).  Pour toute modification de vos données, rendez-vous sur  les démarches  proposées par l\'A​N​T​S (Agence Nationale des Titres Sécurisés).');

  })
})

describe('FormulaireEnvoiMail', () => {
  it('Doit afficher le formulaire de contact pour envoyer un mail', () => {
    const selectedThemeText = 'BUYER_NOT_FOUND';

    const wrapper = mount(FormulaireEnvoiMail, { props: {
        selectedThemeText: selectedThemeText,
      } })

    const divStructure = wrapper.findAll('div');
    expect(divStructure.length).toBe(5);

    const divComp = divStructure[0];
    const p = divComp.find('p')
    expect(p.exists()).true;
    expect(p.classes('fr-text--xs')).true;
    expect(p.text()).toBe('Tous les champs sont obligatoires.');

    const dsfrInput = wrapper.findAll('dsfrinput')
    expect(dsfrInput.length).toBe(2);
    const emailInput = dsfrInput[0]
    expect(emailInput.attributes().label).toBe('Email')
    expect(emailInput.attributes().hint).toBe('Votre email');
    expect(emailInput.attributes().type).toBe('email');

    const messageInput = dsfrInput[1]
    expect(messageInput.attributes().label).toBe('Message')
    expect(messageInput.attributes().hint).toBe('Votre message');

  })
})
