import { CONTACT_THEMES_OPTIONS, DEFAULT_CONTACT_THEMES_OPTIONS } from '../../../src/constants/contact'
import routes from '../../constants/urls.json'

context('Contact', () => {
  const nom = 'MALONGA NTSAYI'
  const prenom = 'JEAN-MARIE'
  const plaqueImmatSIV = 'BQ-910-WK'
  const numeroFormule = '2010ES51284'

  function QuestionSelectAbsente(listeQuestion) {
    for (let i=0;i<listeQuestion.length; i++ ){
      cy.get('select[class*=\'fr-select\']').contains(CONTACT_THEMES_OPTIONS[listeQuestion[i]].text).should('not.exist');
    }
  }
  function verificationFormulaireMail() {
    cy.contains('label','Email').within(() => {
        cy.get('span').contains('Votre email')
      })
      .parents().within(() => {
        cy.get('input')
          .should('have.attr', 'type')
          .and('include', 'mail')
        cy.get('.fr-error-text')
          .should('not.exist')
      })

    cy.contains('label','Message').within(() => {
        cy.get('span').contains('Votre message')
      })
      .parents().within(() => {
        cy.get('textarea')
          .should('be.visible');
        cy.get('.fr-error-text')
          .should('not.exist')
      })

    cy.get('#bouton-envoyer')
      .contains('Envoyer')
      .parents()
      .should('have.attr', 'aria-disabled')
      .and('include', 'true')
  }
  function verificationDesErreursDuFormulaireMail() {
    // vérification du message d'erreur sur le mail
    cy.contains('label','Email')
      .parents().find('input').clear().type('mauvais@mail')
      .parents().find('p').find('span')
      .should('exist')
      .contains('Saisissez une adresse avec un format valide, exemple : nom@exemple.fr')
      .should('be.visible')

    // vérification du message d'erreur sur le message
    cy.contains('label','Message')
      .parents().find('textarea').type('Ceci est mon message.').clear()
      .parent().find('p').find('span')
      .should('exist')
      .contains('Le message est obligatoire. Veuillez le renseigner.')
      .should('be.visible');

    // vérification de l'état du bouton envoyer
    cy.get('#bouton-envoyer')
      .should('have.attr', 'aria-disabled')
      .and('include', 'true')

    // vérification avec les champs valides
    cy.contains('label','Email')
      .parents().find('input').clear().type('test@mail.com')
    cy.contains('label','Message')
      .parents().find('textarea').type('Ceci est mon message.')
    cy.get('.fr-error-text')
      .should('not.exist')
    cy.get('#bouton-envoyer')
      .should('have.attr', 'aria-disabled')
      .and('include', 'false')
  }

  beforeEach(() => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('PUT', '**/contact', { statusCode: 200 })

    cy.visit(routes.url_contact)
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_contact);
    cy.title().should('eq', 'HistoVec - Contact');
  })

  it('Structure de la page contact.', () => {
    // breadcrumb
    cy.get('nav[class*=\'fr-breadcrumb\']').within(() => {
      cy.get('ol')
        .should('have.attr', 'class')
        .and('include', 'fr-breadcrumb__list')
      cy.get('ol>li').should('have.length', 2)
      cy.get('ol>li').eq(0)
        .find('a')
        .contains('Accueil')
        .should('have.attr', 'href').and('include', '/histovec/accueil')
      cy.get('ol>li').eq(1)
        .find('a')
        .contains('Contact')
        .should('not.have.attr', 'href')
    })

    // titre et description
    cy.contains('h1', 'Nous contacter')
    cy.contains('p', 'Vous n\'avez pas trouvé la réponse à votre question dans la page FAQ et Liens utiles ?')
      .contains('a', 'FAQ et Liens utiles')
      .should('have.attr', 'href').and('include', '/faq')
    cy.contains('p', 'Remplissez le formulaire ci-dessous et expliquez-nous votre problème.')

    // formulaire
    cy.contains('label', 'Veuillez choisir un ou plusieurs thèmes :')
      .parent()
      .find('ul').within(() => {
        cy.get('li').should('have.length', 5)
        cy.get('li').eq(0).find('button').find('span').contains('Certificat d\'immatriculation / Carte grise')
        cy.get('li').eq(1).find('button').find('span').contains('Titulaire / Propriétaire')
        cy.get('li').eq(2).find('button').find('span').contains('Rapport HistoVec')
        cy.get('li').eq(3).find('button').find('span').contains('Véhicule')
        cy.get('li').eq(4).find('button').find('span').contains('Autre')
      })
    cy.contains('label', 'Thèmes (10 choix possibles)')
      .parent().within(() => {
        cy.get('span').should('have.length', 2)
        cy.get('span').eq(0).contains('*')
        cy.get('span').eq(1).contains('Sélectionnez un thème parmi les suivants.')
      })
    cy.get('select').within(() => {
      cy.get('option').should('have.length', 11)
      cy.get('option').eq(0).contains('Sélectionnez une option')
      cy.get('option').eq(1).contains(CONTACT_THEMES_OPTIONS[0].text)
      cy.get('option').eq(2).contains(CONTACT_THEMES_OPTIONS[1].text)
      cy.get('option').eq(3).contains(CONTACT_THEMES_OPTIONS[2].text)
      cy.get('option').eq(4).contains(CONTACT_THEMES_OPTIONS[3].text)
      cy.get('option').eq(5).contains(CONTACT_THEMES_OPTIONS[4].text)
      cy.get('option').eq(6).contains(CONTACT_THEMES_OPTIONS[5].text)
      cy.get('option').eq(7).contains(CONTACT_THEMES_OPTIONS[6].text)
      cy.get('option').eq(8).contains(CONTACT_THEMES_OPTIONS[7].text)
      cy.get('option').eq(9).contains(CONTACT_THEMES_OPTIONS[8].text)
      cy.get('option').eq(10).contains(DEFAULT_CONTACT_THEMES_OPTIONS[0].text)
    })
  })
  it('Filtrer les thèmes de la liste déroulante', () => {
    cy.get('label[class*=\'fr-label\']').contains('Thèmes (10 choix possibles)');
    cy.get('select[class*=\'fr-select\']').contains(CONTACT_THEMES_OPTIONS[1].text);
    // Critere RGAA remplace type par des id
    cy.get('button[id*=\'CERTIFICAT_IMMATRICULATION\']').click();

    //Filtre Select Tag Certificat
    cy.get('label[class*=\'fr-label\']').contains('Thèmes (3 choix possibles)');
    cy.get('select[class*=\'fr-select\']').contains(CONTACT_THEMES_OPTIONS[1].text);
    cy.get('select[class*=\'fr-select\']').contains(CONTACT_THEMES_OPTIONS[2].text);
    QuestionSelectAbsente([6, 3, 4, 5, 7, 8]);

    //Filtre Select Tag Titulaire
    cy.get('button[id*=\'CERTIFICAT_IMMATRICULATION\']').click();
    cy.get('button[id*=\'PROPRIETAIRE_OU_TITULAIRE\']').click();

    cy.get('label[class*=\'fr-label\']').contains('Thèmes (7 choix possibles)');
    QuestionSelectAbsente([5, 7, 8]);

    //Filtre Select Tag Rapport
    cy.get('button[id*=\'PROPRIETAIRE_OU_TITULAIRE\']').click();
    cy.get('button[id*=\'RAPPORT_HISTOVEC\']').click();

    cy.get('label[class*=\'fr-label\']').contains('Thèmes (5 choix possibles)');
    QuestionSelectAbsente([0, 1, 2, 3, 8]);

    //Filtre Select Tag Véhicule
    cy.get('button[id*=\'RAPPORT_HISTOVEC\']').click();
    cy.get('button[id*=\'VEHICULE\']').click();

    cy.get('label[class*=\'fr-label\']').contains('Thèmes (8 choix possibles)');
    QuestionSelectAbsente([7, 8]);

    //Filtre Select Tag Autre
    cy.get('button[id*=\'VEHICULE\']').click();
    cy.get('button[id*=\'AUTRE\']').click();

    cy.get('label[class*=\'fr-label\']').contains('Thèmes (5 choix possibles)');
    QuestionSelectAbsente([0, 1, 2, 4, 6]);
  })
  it('Sélectionner thème Marche à Suivre', () => {
    // question 1
    cy.get('select').select(CONTACT_THEMES_OPTIONS[0].text);
    cy.contains('h2', 'Marche à suivre');
    cy.contains('p', 'Il convient d\'effectuer les démarches de déclaration de cession du véhicule auprès de l\'A​N​T​S (Agence Nationale des Titres Sécurisés).')
      .find('a')
      .contains('démarches de déclaration de cession du véhicule')
      .should('have.attr', 'href').and('include', 'https://immatriculation.ants.gouv.fr/Questions-frequentes/Vendre-ou-donner-mon-vehicule/Commencer-une-declaration-de-cession')

    // question 2
    cy.get('select').select(CONTACT_THEMES_OPTIONS[1].text);
    cy.contains('h2', 'Marche à suivre');
    cy.contains('p', 'Il convient d\'effectuer les démarches de changement de titulaire du certificat d\'immatriculation auprès de l\'A​N​T​S (Agence Nationale des Titres Sécurisés).')
      .find('a')
      .contains('démarches de changement de titulaire du certificat d\'immatriculation')
      .should('have.attr', 'href').and('include', 'https://immatriculation.ants.gouv.fr/Questions-frequentes/Acheter-ou-recevoir-un-vehicule-d-occasion/Realiser-la-teleprocedure-J-achete-ou-je-recois-un-vehicule-d-occasion')

    // question 3
    cy.get('select[class*=\'fr-select\']').select(CONTACT_THEMES_OPTIONS[2].text);
    cy.contains('h2', 'Marche à suivre');
    cy.contains('p', 'Il convient d\'effectuer les démarches de déclaration de perte ou de vol du certificat d\'immatriculation auprès de l\'A​N​T​S (Agence Nationale des Titres Sécurisés).')
      .find('a')
      .contains('démarches de déclaration de perte ou de vol du certificat d\'immatriculation')
      .should('have.attr', 'href').and('include', 'https://immatriculation.ants.gouv.fr/Vos-demarches/Obtenir-un-duplicata-en-cas-de-perte-vol-deterioration')

    // question 4
    cy.get('select[class*=\'fr-select\']').select(CONTACT_THEMES_OPTIONS[3].text);
    cy.contains('h2', 'Marche à suivre');
    cy.contains('p', 'Il convient de contacter le Centre Amendes Service au 08 21 08 00 31 (appel surtaxé) ou l\'Agence nationale de traitement automatisé des infractions (A​N​T​A​I) .')
      .find('a')
      .contains('l\'Agence nationale de traitement automatisé des infractions (A​N​T​A​I)')
      .should('have.attr', 'href').and('include', 'https://www.antai.gouv.fr')

    // question 5
    cy.get('select[class*=\'fr-select\']').select(CONTACT_THEMES_OPTIONS[4].text);
    cy.contains('h2', 'Marche à suivre');
    cy.contains('p', 'HistoVec vous permet de consulter les données enregistrées dans le SIV (Système d\'Immatriculation des Véhicules). Pour toute modification de vos données, rendez-vous sur les démarches proposées par l\'A​N​T​S (Agence Nationale des Titres Sécurisés).')
      .find('a')
      .contains('les démarches')
      .should('have.attr', 'href').and('include', 'https://immatriculation.ants.gouv.fr/Questions-frequentes/Demarche-Je-souhaite-faire-une-autre-demande')
  })
  it('Affichage formulaire de contact', () => {
    cy.get('select').select(CONTACT_THEMES_OPTIONS[5].text);
    verificationFormulaireMail()

    cy.get('select').select(CONTACT_THEMES_OPTIONS[6].text);
    verificationFormulaireMail()

    cy.get('select').select(CONTACT_THEMES_OPTIONS[7].text);
    verificationFormulaireMail()

    cy.get('select').select(CONTACT_THEMES_OPTIONS[8].text);
    verificationFormulaireMail()

    cy.get('select').select(DEFAULT_CONTACT_THEMES_OPTIONS[0].text);
    verificationFormulaireMail()
  })
  it('Affichage des messages d\'erreurs du formulaire de contact', () => {
    cy.get('select').select(CONTACT_THEMES_OPTIONS[5].text);
    verificationDesErreursDuFormulaireMail()

    cy.get('select').select(CONTACT_THEMES_OPTIONS[6].text);
    verificationDesErreursDuFormulaireMail()

    cy.get('select').select(CONTACT_THEMES_OPTIONS[7].text);
    verificationDesErreursDuFormulaireMail()

    cy.get('select').select(CONTACT_THEMES_OPTIONS[8].text);
    verificationDesErreursDuFormulaireMail()

    cy.get('select').select(DEFAULT_CONTACT_THEMES_OPTIONS[0].text);
    verificationDesErreursDuFormulaireMail()
  })
  it('Affichage données particulier - immatriculation depuis 2009 ', () => {
    // redirection vers la page propriétaire
    cy.visit(routes.url_proprietaire)
    cy.title().should('eq', 'HistoVec - Propriétaire')

    // mock de la requete
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('PUT', '**/search', { statusCode: 200 })
    cy.intercept('POST', '/public/v1/report_by_data/siv/physique/**', { statusCode: 200, fixture: 'api/reponseRequeteApiSivParticulier200.json' })
    cy.intercept('GET', '/get_buyer_qrcode/**', { statusCode: 200 })
    cy.intercept('PUT', '**/holder/cached', { statusCode: 200 })
    cy.intercept('PUT', '**/holder/ok', { statusCode: 200 })
    cy.intercept('GET', '/public/v1/get_buyer_qrcode/**', { statusCode: 200 })

    // renseignement du formulaire
    cy.get('img[src*=\'/histovec/src/assets/img/plaque_siv.svg\']')
      .click()
    cy.get('input[id*=\'form-siv-particulier-nom-naissance\']')
      .should('exist')
      .clear()
      .type(nom)
    cy.get('input[id*=\'form-siv-particulier-prenom\']')
      .should('exist')
      .clear()
      .type(prenom)
    cy.get('input[id*=\'form-siv-particulier-numero-immatriculation\']')
      .should('exist')
      .clear()
      .type(plaqueImmatSIV)
    cy.get('input[id*=\'form-siv-particulier-numero-formule\']')
      .should('exist')
      .clear()
      .type(numeroFormule)

    // validation du formulaire
    cy.get('button[id*=\'bouton-recherche\']')
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(500)
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_rapport_vendeur)
    cy.title().should('eq', 'HistoVec - Rapport vendeur')

    // retour page contact
    cy.get('a[title*="Contact"]').contains('Contact').click()
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_contact)
    cy.title().should('eq', 'HistoVec - Contact')
    cy.get('select').select(CONTACT_THEMES_OPTIONS[5].text)

    // verification de l'affichage
    cy.wait(500).get('h2')
      .contains('Données transmises pour l\'assistance')
      .should('exist')
      .parent().within(() => {
        cy.get('li').should('have.length', 4)
        cy.get('li').eq(0).contains('Nom de naissance: '+ nom).find('span').contains(nom)
        cy.get('li').eq(1).contains('Prénom(s): '+ prenom).find('span').contains(prenom)
        cy.get('li').eq(2).contains('Immatriculation: '+ plaqueImmatSIV).find('span').contains(plaqueImmatSIV)
        cy.get('li').eq(3).contains('Numéro de formule: '+ numeroFormule).find('span').contains(numeroFormule)
      })
  })
  it('Affichage données personne morale - immatriculation depuis 2009 ', () => {
    // redirection vers la page propriétaire
    cy.visit(routes.url_proprietaire)
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_proprietaire);
    cy.title().should('eq', 'HistoVec - Propriétaire')

    // mock de la requete
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('PUT', '**/search', { statusCode: 200 })
    cy.intercept('POST', '/public/v1/report_by_data/siv/morale/**', { statusCode: 200, fixture: 'api/reponseRequeteApiSivProfessionnel200.json' })
    cy.intercept('GET', '/get_buyer_qrcode/**', { statusCode: 200 })
    cy.intercept('PUT', '**/holder/cached', { statusCode: 200 })
    cy.intercept('PUT', '**/holder/ok', { statusCode: 200 })
    cy.intercept('GET', '/public/v1/get_buyer_qrcode/**', { statusCode: 200 })

    // selection du formulaire
    cy.get('img[src*=\'/histovec/src/assets/img/plaque_siv.svg\']')
      .click()
    cy.contains('button', 'Personne morale')
      .should('have.length', 1)
      .click()

    // renseignement du formulaire
    cy.get('input[id*=\'form-siv-personne-morale-raison-sociale\']')
      .should('exist')
      .clear()
      .type('raison sociale')
    cy.get('input[id*=\'form-siv-personne-morale-numero-siren\']')
      .should('exist')
      .clear()
      .type('123453424')
    cy.get('input[id*=\'form-siv-personne-morale-numero-immatriculation\']')
      .should('exist')
      .clear()
      .type('AA-123-AA')
    cy.get('input[id*=\'form-siv-personne-morale-numero-formule\']')
      .should('exist')
      .clear()
      .type('2013BZ80335')

    // validation du formulaire
    cy.get('button[id*=\'bouton-recherche\']')
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(500);
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_rapport_vendeur);
    cy.title().should('eq', 'HistoVec - Rapport vendeur');

    // retour page contact
    cy.get('a[title*="Contact"]').contains('Contact').click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_contact);
    cy.title().should('eq', 'HistoVec - Contact');
    cy.get('select').select(CONTACT_THEMES_OPTIONS[5].text);

    // verification de l'affichage
    cy.wait(500).get('h2')
      .contains('Données transmises pour l\'assistance')
      .should('exist')
      .parent().within(() => {
      cy.get('li').should('have.length', 4)
      cy.get('li').eq(0).contains('Raison sociale: raison sociale').find('span').contains('raison sociale')
      cy.get('li').eq(1).contains('Numéro SIREN: 123453424').find('span').contains('123453424')
      cy.get('li').eq(2).contains('Immatriculation: AA-123-AA').find('span').contains('AA-123-AA')
      cy.get('li').eq(3).contains('Numéro de formule: 2013BZ80335').find('span').contains('2013BZ80335')
    })
  })
  // todo : ajouter le test quand la requete de ivt personne physique sera ajouté
  it.skip('Affichage données particulier - immatriculation avant 2009 ', () => {
    // redirection vers la page propriétaire
    cy.visit(routes.url_proprietaire)
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_proprietaire);
    cy.title().should('eq', 'HistoVec - Propriétaire')

    // mock de la requete
    cy.intercept('POST', '**/public/v1/report_by_data/siv/physique/**', { fixture: 'aucuneAnomalie.json' }).as('dataVehicule')

    // selection du formulaire
    cy.get('img[src*=\'/histovec/src/assets/img/plaque_fni.svg\']')
      .click()

    // renseignement du formulaire
    cy.get('input[id*=\'form-fni-particulier-nom-prenom\']')
      .should('exist')
      .clear()
      .type('Nom Prenom')
    cy.get('input[id*=\'form-fni-particulier-numero-immatriculation\']')
      .should('exist')
      .clear()
      .type('123-ABC-45')
    cy.get('input[id*=\'form-fni-particulier-date-emission\']')
      .should('exist')
      .clear()
      .type('25/06/2001')

    // validation du formulaire
    cy.get('button[id*=\'bouton-recherche\']')
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(500);
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_rapport_vendeur);
    cy.title().should('eq', 'HistoVec - Rapport vendeur');

    // retour page contact
    cy.get('a[title*="Contact"]').contains('Contact').click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_contact);
    cy.title().should('eq', 'HistoVec - Contact');
    cy.get('select').select(CONTACT_THEMES_OPTIONS[5].text);

    // verification de l'affichage
    cy.wait(500).get('h2')
      .contains('Données transmises pour l\'assistance')
      .should('exist')
      .parent().within(() => {
      cy.get('li').should('have.length', 3)
      cy.get('li').eq(0).contains('Nom de naissance et prénom(s): Nom Prenom').find('span').contains('Nom Prenom')
      cy.get('li').eq(1).contains('Immatriculation: 123-ABC-45').find('span').contains('123-ABC-45')
      cy.get('li').eq(2).contains('Date du certificat : 2001-06-25').find('span').contains('2001-06-25')
    })
  })
  // todo : ajouter le test quand la requete de ivt personne moral sera ajouté
  it.skip('Affichage données personne morale - immatriculation avant 2009 ', () => {
    // redirection vers la page propriétaire
    cy.visit(routes.url_proprietaire)
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_proprietaire);
    cy.title().should('eq', 'HistoVec - Propriétaire')

    // mock de la requete
    cy.intercept('POST', '**/public/v1/report_by_data/siv/physique/**', { fixture: 'aucuneAnomalie.json' }).as('dataVehicule')

    // selection du formulaire
    cy.get('img[src*=\'/histovec/src/assets/img/plaque_fni.svg\']')
      .click()
    cy.contains('button', 'Personne morale')
      .should('have.length', 1)
      .click()

    // renseignement du formulaire
    cy.get('input[id*=\'form-fni-personne-morale-raison-sociale\']')
      .should('exist')
      .clear()
      .type('raison sociale')
    cy.get('input[id*=\'form-fni-personne-morale-numero-siren\']')
      .should('exist')
      .clear()
      .type('123453424')
    cy.get('input[id*=\'form-fni-personne-morale-numero-immatriculation\']')
      .should('exist')
      .clear()
      .type('123-ABC-45')
    cy.get('input[id*=\'form-fni-personne-morale-date-emission\']')
      .should('exist')
      .clear()
      .type('25/06/2001')

    // validation du formulaire
    cy.get('button[id*=\'bouton-recherche\']')
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(500);
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_rapport_vendeur);
    cy.title().should('eq', 'HistoVec - Rapport vendeur');

    // retour page contact
    cy.get('a[title*="Contact"]').contains('Contact').click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_contact);
    cy.title().should('eq', 'HistoVec - Contact');
    cy.get('select').select(CONTACT_THEMES_OPTIONS[5].text);

    // verification de l'affichage
    cy.wait(500).get('h2')
      .contains('Données transmises pour l\'assistance')
      .should('exist')
      .parent().within(() => {
      cy.get('li').should('have.length', 4)
      cy.get('li').eq(0).contains('Raison sociale: raison sociale').find('span').contains('raison sociale')
      cy.get('li').eq(1).contains('Numéro SIREN: 123453424').find('span').contains('123453424')
      cy.get('li').eq(2).contains('Immatriculation: 123-ABC-45').find('span').contains('123-ABC-45')
      cy.get('li').eq(3).contains('Date du certificat : 2001-06-25').find('span').contains('2001-06-25')
    })
  })
  // todo : ajouter le test quand la requete de contact sera ajouté
  it.skip('Envoyer Mail sans donnée proprietaire avec succes', () => {
    cy.get('select').select(CONTACT_THEMES_OPTIONS[5].text);
    cy.contains('label','Email')
      .parents().find('input').type('test@mail.com')
    cy.contains('label','Message')
      .parents().find('textarea').type('Ceci est mon message.')
    cy.get('#bouton-envoyer').click()
    cy.get('div[class*=\'fr-alert fr-alert--success\']').within(() => {
      cy.get('p').should('have.length', 2)
      cy.get('p').eq(0)
        .contains('Envoi du message effectué avec succès')
      cy.get('p').eq(1)
        .contains('Votre message a bien été transmis à nos équipes. Nous vous répondrons dès que possible.')
    })
  })
  // todo : ajouter le test quand la requete de contact sera ajouté
  it.skip('Envoyer Mail sans donnée proprietaire avec erreur', () => {
    cy.get('select').select(CONTACT_THEMES_OPTIONS[5].text);
    cy.contains('label','Email')
      .parents().find('input').type('test@mail.test')
    cy.contains('label','Message')
      .parents().find('textarea').type('Ceci est mon message.')
    cy.get('#bouton-envoyer').click()
    cy.get('div[class*=\'fr-alert fr-alert--error\']').within(() => {
      cy.get('p').should('have.length', 2)
      cy.get('p').eq(0)
        .contains('Échec de l\'envoi du message')
      cy.get('p').eq(1)
        .contains('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.')
    })
  })
  // todo : ajouter le test quand la requete de contact sera ajouté
  it.skip('Envoyer Mail avec donnée proprietaire', () => {
    // redirection vers la page propriétaire
    cy.visit(routes.url_proprietaire)
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_proprietaire);
    cy.title().should('eq', 'HistoVec - Propriétaire')

    // mock de la requete
    cy.intercept('POST', '**/histovec/api/v1/report_by_data/siv/personne', { statusCode: 200, fixture: '/api/reponseRequeteApiSivParticulier200' })

    // renseignement du formulaire
    cy.get('img[src*=\'/histovec/src/assets/img/plaque_siv.svg\']')
      .click()
    cy.get('input[id*=\'form-siv-particulier-nom-naissance\']')
      .should('exist')
      .clear().type(nom)
    cy.get('input[id*=\'form-siv-particulier-prenom\']')
      .should('exist')
      .clear().type(prenom)
    cy.get('input[id*=\'form-siv-particulier-numero-immatriculation\']')
      .should('exist')
      .clear().type(plaqueImmatSIV)
    cy.get('input[id*=\'form-siv-particulier-numero-formule\']')
      .should('exist')
      .clear().type(numeroFormule)

    // validation du formulaire
    cy.get('button[id*=\'bouton-recherche\']')
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(1000);
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_rapport_vendeur);
    cy.title().should('eq', 'HistoVec - Rapport vendeur');
    cy.get('a[title*="Contact"]').contains('Contact').click();

    // retour page contact
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_contact);
    cy.title().should('eq', 'HistoVec - Contact');
    cy.get('select').select(CONTACT_THEMES_OPTIONS[5].text);

    cy.get('#bouton-envoyer')
      .should('be.disabled')
      .should('have.attr', 'aria-disabled')
      .and('include', 'true')

    cy.contains('label','Email')
      .parents().find('input').type('test@mail.test')
    cy.contains('label','Message')
      .parents().find('textarea').type('Ceci est mon message.')

    cy.wait(500).get('#bouton-envoyer').click()
    cy.get('div[class*=\'fr-alert fr-alert--success\']').within(() => {
      cy.get('p').should('have.length', 2)
      cy.get('p').eq(0)
        .contains('Envoi du message effectué avec succès')
      cy.get('p').eq(1)
        .contains('Votre message a bien été transmis à nos équipes. Nous vous répondrons dès que possible.')
    })
  })
})
