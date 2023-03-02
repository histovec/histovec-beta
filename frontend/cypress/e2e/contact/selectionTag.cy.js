import { CONTACT_THEMES_OPTIONS } from '../../../src/constants/contact'

context('Contact', () => {

  function QuestionSelectAbsente(listeQuestion) {
    for (let i=0;i<listeQuestion.length; i++ ){
      cy.get('select[class*=\'fr-select\']').contains(CONTACT_THEMES_OPTIONS[listeQuestion[i]].text).should('not.exist');
    }
  }

  beforeEach(() => {
    cy.visit('http://localhost:8080/histovec/accueil');
    cy.title().should('eq', 'HistoVec - Accueil');

    cy.get('a[title*="Contact"]')
      .contains('Contact')
      .click();

    cy.url().should('eq', 'http://localhost:8080/histovec/contact');
  })

  it('Filtrer les thèmes de la liste déroulante', () => {

    cy.get('label[class*=\'fr-label\']').contains('Thèmes (10 choix possibles)');
    cy.get('select[class*=\'fr-select\']').contains(CONTACT_THEMES_OPTIONS[1].text);
    // Critere RGAA remplace type par des id
    cy.get('button[type*=\'CERTIFICAT_IMMATRICULATION\']').click();

    //Filtre Select Tag Certificat
    cy.get('label[class*=\'fr-label\']').contains('Thèmes (3 choix possibles)');
    cy.get('select[class*=\'fr-select\']').contains(CONTACT_THEMES_OPTIONS[1].text);
    cy.get('select[class*=\'fr-select\']').contains(CONTACT_THEMES_OPTIONS[2].text);
    QuestionSelectAbsente([6, 3, 4, 5, 7, 8]);

    //Filtre Select Tag Titulaire
    cy.get('button[type*=\'CERTIFICAT_IMMATRICULATION\']').click();
    cy.get('button[type*=\'PROPRIETAIRE_OU_TITULAIRE\']').click();

    cy.get('label[class*=\'fr-label\']').contains('Thèmes (7 choix possibles)');
    QuestionSelectAbsente([5, 7, 8]);

    //Filtre Select Tag Rapport
    cy.get('button[type*=\'PROPRIETAIRE_OU_TITULAIRE\']').click();
    cy.get('button[type*=\'RAPPORT_HISTOVEC\']').click();

    cy.get('label[class*=\'fr-label\']').contains('Thèmes (5 choix possibles)');
    QuestionSelectAbsente([0, 1, 2, 3, 8]);

    //Filtre Select Tag Véhicule
    cy.get('button[type*=\'RAPPORT_HISTOVEC\']').click();
    cy.get('button[type*=\'VEHICULE\']').click();

    cy.get('label[class*=\'fr-label\']').contains('Thèmes (8 choix possibles)');
    QuestionSelectAbsente([7, 8]);

    //Filtre Select Tag Autre
    cy.get('button[type*=\'VEHICULE\']').click();
    cy.get('button[type*=\'AUTRE\']').click();

    cy.get('label[class*=\'fr-label\']').contains('Thèmes (5 choix possibles)');
    QuestionSelectAbsente([0, 1, 2, 4, 6]);
  })

  it('Sélectionner thème Marche à Suivre', () => {

    cy.get('label[class*=\'fr-label\']').contains('Thèmes (10 choix possibles)');
    cy.get('select[class*=\'fr-select\']').select(CONTACT_THEMES_OPTIONS[0].text);

    cy.get('h5').contains('Marche à suivre');
    cy.get('a').contains('démarches de déclaration de cession du véhicule');

    cy.get('select[class*=\'fr-select\']').select(CONTACT_THEMES_OPTIONS[1].text);

    cy.wait(500).get('h5').contains('Marche à suivre');
    cy.get('a').contains('démarches de changement de titulaire du certificat d\'immatriculation');

    cy.get('select[class*=\'fr-select\']').select(CONTACT_THEMES_OPTIONS[2].text);

    cy.wait(500).get('h5').contains('Marche à suivre');
    cy.get('a').contains(' démarches de déclaration de perte ou de vol du certificat d\'immatriculation ');

    cy.get('select[class*=\'fr-select\']').select(CONTACT_THEMES_OPTIONS[3].text);

    cy.wait(500).get('h5').contains('Marche à suivre');
    cy.get('a').contains(' l\'Agence nationale de traitement automatisé des infractions (ANTAI) ');

    cy.get('select[class*=\'fr-select\']').select(CONTACT_THEMES_OPTIONS[4].text);

    cy.wait(500).get('h5').contains('Marche à suivre');
    cy.get('p').contains('HistoVec vous permet de consulter les données enregistrées dans le SIV (Système d\'Immatriculation des Véhicules).');

  })

  it('Remplir formulaire de contact', () => {

    cy.get('select[class*=\'fr-select\']').select(CONTACT_THEMES_OPTIONS[5].text);

    cy.wait(500).get('label').contains('Email');
    cy.get('button').should('be.disabled');

    // renseignement du formulaire
    cy.get('input[type*=\'email\']').should('exist').type('erreur');
    // critere RGAA le message doit être modifié
    cy.get('input[type*=\'email\']').parent().children('.fr-error-text').should('exist').contains('L\'email est obligatoire. Veuillez le renseigner.');

    cy.get('input[type*=\'email\']').clear().type('email.test@nomdomaine.fr');

    cy.get('textarea').type('erreur').clear();
    cy.get('textarea').parent().children('.fr-error-text').should('exist').contains('Le message est obligatoire. Veuillez le renseigner.');
    cy.get('textarea').type('message');

    cy.get('button').should('be.enabled');
  })

  it('Envoyer Mail sans donnée proprietaire', () => {
    cy.get('select[class*=\'fr-select\']').select(CONTACT_THEMES_OPTIONS[5].text);

    cy.wait(500).get('label').contains('Email');
    cy.get('button').should('be.disabled');
    cy.get('input[type*=\'email\']').clear().type('email.test@nomdomaine.fr');

    cy.get('textarea').type('erreur');
    cy.get('button[class*=\'fr-btn\']').contains('Envoyer').click();

    cy.wait(3000).get('div[class*=\'alert-content\']').contains('Envoi du message effectué avec succès').should('exist');
  })

  it('Envoyer Mail avec donnée proprietaire', () => {
    // redirection vers la page propriétaire
    cy.visit('http://localhost:8080/histovec/proprietaire')
    cy.title().should('eq', 'HistoVec - Propriétaire')

    // mock de la requete
    cy.intercept('POST', '/histovec/api/v1/report_by_data', { fixture: 'aucuneAnomalie.json' }).as('dataVehicule')

    // renseignement du formulaire
    cy.get('img[src*=\'/histovec/src/assets/img/plaque_siv.svg\']')
      .click()
    cy.get('input[id*=\'form-input-nom-naissance\']')
      .should('exist')
      .type('nom')
    cy.get('input[id*=\'form-input-prenom\']')
      .should('exist')
      .type('prenom')
    cy.get('input[id*=\'form-input-numero-immatriculation\']')
      .should('exist')
      .type('AA-123-AA')
    cy.get('input[id*=\'form-input-numero-formule\']')
      .should('exist')
      .type('2013BZ80335')

    // validation du formulaire
    cy.get('button[id*=\'bouton-recherche\']')
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(1000);
    cy.url().should('eq', 'http://localhost:8080/histovec/rapport-vendeur');
    cy.title().should('eq', 'HistoVec - Rapport vendeur');
    cy.get('a[title*="Contact"]').contains('Contact').click();

    cy.url().should('eq', 'http://localhost:8080/histovec/contact');

    cy.get('select[class*=\'fr-select\']').select(CONTACT_THEMES_OPTIONS[5].text);

    cy.wait(500).get('label').contains('Email');
    cy.get('button').should('be.disabled');
    cy.get('input[type*=\'email\']').clear().type('email.test@nomdomaine.fr');

    cy.get('textarea').type('erreur');

    cy.get('h6').contains('Données transmises pour l\'assistance').should('exist');
    cy.get('span[class*=\'fr-blue-text\']').contains('nom').should('exist');
    cy.get('span[class*=\'fr-blue-text\']').contains('prenom').should('exist');
    cy.get('span[class*=\'fr-blue-text\']').contains('AA-123-AA').should('exist');
    cy.get('span[class*=\'fr-blue-text\']').contains('2013BZ80335').should('exist');

    cy.get('button[class*=\'fr-btn\']').contains('Envoyer').click();

    cy.wait(3000).get('div[class*=\'alert-content\']').contains('Envoi du message effectué avec succès').should('exist');
    cy.get('input[type*=\'email\']').clear().type('email.test@nomdomaine.fr');

  })

})
