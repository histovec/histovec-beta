const onglets = ['Propriétaire', 'Acheteur', 'FAQ', 'Contact'];
const excludeAxe = {
  exclude: [],
};
const skipFailure = true;
const rulesAxe =
  {
    rules: {
      //'heading-order': { enabled: false },
      //'color-contrast': { enabled: false },
    },
  };
const violation = (violations) => {
  cy.task('log', `Ecarts détectés ${violations.length}`)
  violations.forEach((violation) => {
    cy.task('log', {
      id: violation.id,
      impact: violation.impact,
      tags: violation.tags,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl
    })
    cy.task('log', `Occurence ${violation.id} : ${violation.nodes.length}`)
    violation.nodes.forEach((node) => {
      cy.task('log', {
        impact: node.impact,
        html: node.html,
        target: node.target,
        failureSummary: node.failureSummary
      });
    })
  })
  //cy.task('log', violations);
  //cy.log(violations);
}
const histovecUrl = 'http://localhost:8080/histovec/';
const proprietaires = [
  {
    bouton: 'label[for=SIV]',
    tab: '#siv-tab-0',
    nom: 'SIV Propriétaire physique',
    champs: [
      {
        nom: '#form-siv-particulier-nom-naissance',
        valeur: 'CREVON'
      }, {
        nom: '#form-siv-particulier-prenom',
        valeur: 'TONY'
      }, {
        nom: '#form-siv-particulier-numero-immatriculation',
        valeur: 'BH-741-GB'
      }, {
        nom: '#form-siv-particulier-numero-formule',
        valeur: '2013FP46373'
      }
    ],
    tabsResultat: [
      '#report-tab-0',
      '#report-tab-1',
      '#report-tab-2',
      '#report-tab-3',
      '#report-tab-4'
    ]
  },
  {
    bouton: 'label[for=SIV]',
    tab: '#siv-tab-1',
    nom: 'SIV Propriétaire Moral',
    champs: [
      {
        nom: '#form-siv-personne-morale-raison-sociale',
        valeur: 'CARROSSERIE DU CANAL'
      }, {
        nom: '#form-siv-personne-morale-numero-siren',
        valeur: '448498014'
      }, {
        nom: '#form-siv-personne-morale-numero-immatriculation',
        valeur: 'DH-429-PA'
      }, {
        nom: '#form-siv-personne-morale-numero-formule',
        valeur: '2010FA65713'
      }
    ],
    tabsResultat: []
  },
  {
    bouton: 'label[for=FNI]',
    tab: '#fni-tab-0',
    nom: 'FNI Propriétaire Physique',
    champs: [
      {
        nom: '#form-fni-particulier-nom-prenom',
        valeur: 'ALLAIN LUCIEN'
      }, {
        nom: '#form-fni-particulier-numero-immatriculation',
        valeur: '4341RZ41'
      }, {
        nom: '#form-fni-particulier-date-emission',
        valeur: '03/06/2008'
      }
    ],
    tabsResultat: []
  },
  {
    bouton: 'label[for=FNI]',
    tab: '#fni-tab-1',
    nom: 'FNI Propriétaire Moral',
    champs: [
      {
        nom: '#form-fni-personne-morale-raison-sociale',
        valeur: 'COMAZUR'
      }, {
        nom: '#form-fni-personne-morale-numero-siren',
        valeur: '331346296'
      }, {
        nom: '#form-fni-personne-morale-numero-immatriculation',
        valeur: '7557VV64'
      }, {
        nom: '#form-fni-personne-morale-date-emission',
        valeur: '22/07/2002'
      }
    ],
    tabsResultat: []
  }
];

describe('Histovec ne contient pas de défaut d\'accessibilité', () => {
  beforeEach(() => {
    cy.visit(`${histovecUrl}`)
  });
  it('La page d\'accueil ne présente pas de défaut d\'accessibilité', () => {
    cy.task('log', `début La page d'accueil ne présente pas de défaut d'accessibilité`);
    cy.injectAxe();
    cy.checkA11y(excludeAxe, rulesAxe, violation, skipFailure);
    cy.task('log', `fin La page d'accueil ne présente pas de défaut d'accessibilité`);
  })
  it(`La page Contact ne présente pas de défaut d'accessibilité`, () => {
    cy.task('log', `début La page Contact ne présente pas de défaut d'accessibilité`);
    cy.get('a.fr-nav__link').contains('Contact').click();
    cy.get('.fr-select').should('exist').select("VEHICLE_DATA");
    cy.injectAxe();
    cy.checkA11y(excludeAxe, rulesAxe, violation, skipFailure);
    cy.task('log', `fin La page Contact ne présente pas de défaut d'accessibilité`);
  });
  it(`La page FAQ ne présente pas de défaut d'accessibilité`, () => {
    cy.task('log', `début La page FAQ ne présente pas de défaut d'accessibilité`);
    cy.get('a.fr-nav__link').contains('FAQ').click();
    cy.get('.fr-select').should('exist').select("HOW_HISTOVEC");
    cy.get('.fr-accordion__btn').contains('Qui').click();
    cy.injectAxe();
    cy.checkA11y(excludeAxe, rulesAxe, violation, skipFailure);
    cy.task('log', `fin La page FAQ ne présente pas de défaut d'accessibilité`);
  });
  it(`La page accessibilite ne présente pas de défaut d'accessibilité`, () => {
    cy.task('log', `début La page accessibilite ne présente pas de défaut d'accessibilité`);
    cy.visit(`${histovecUrl}accessibilite`);
    cy.injectAxe();
    cy.checkA11y(excludeAxe, rulesAxe, violation, skipFailure);
    cy.task('log', `fin La page accessibilite ne présente pas de défaut d'accessibilité`);
  });
  it(`La page DCP ne présente pas de défaut d'accessibilité`, () => {
    cy.task('log', `début La page DCP ne présente pas de défaut d'accessibilité`);
    cy.visit(`${histovecUrl}donnees-personnelles-et-cookies`);
    cy.injectAxe();
    cy.checkA11y(excludeAxe, rulesAxe, violation, skipFailure);
    cy.task('log', `fin La page DCP ne présente pas de défaut d'accessibilité`);
  });
  proprietaires.forEach((proprietaire) => {
    it(`La page formulaire ${proprietaire.nom} ne contient pas de défaut d'accessibilité`, () => {
      cy.task('log', `début La page formulaire ${proprietaire.nom} ne contient pas de défaut d'accessibilité`);
      cy.get('a.fr-nav__link').contains("Propriétaire").click();
      cy.task('log', `clik onglet proprietaire`);
      cy.get(proprietaire.bouton).should('exist').click();
      cy.task('log', `clik tab ${proprietaire.tab}`);
      cy.get('li:has(' + proprietaire.tab + ')').click();
      cy.task('log', `clik effacer formulaire`);
      cy.get('#bouton-effacer').click();
      proprietaire.champs.forEach((champ) => {
        cy.get(champ.nom).type(champ.valeur);
      });
      cy.task('log', `saisie formulaire`);
      cy.injectAxe();
      cy.checkA11y(excludeAxe, rulesAxe, violation, skipFailure);
      cy.task('log', `fin La page formulaire ${proprietaire.nom} ne contient pas de défaut d'accessibilité`);
    });
    it(`Le résultat ${proprietaire.nom} ne contient pas de défaut d'accessibilité`, () => {
      cy.task('log', `début Le résultat ${proprietaire.nom} ne contient pas de défaut d'accessibilité`);
      cy.task('log', `clik onglet proprietaire`);
      cy.get('a.fr-nav__link').contains("Propriétaire").click();
      cy.get(proprietaire.bouton).should('exist').click();
      cy.task('log', `clik tab ${proprietaire.tab}`);
      cy.get('li:has(' + proprietaire.tab + ')').click();
      cy.task('log', `clik effacer formulaire`);
      cy.get('#bouton-effacer').click();
      proprietaire.champs.forEach((champ) => {
        cy.get(champ.nom).type(champ.valeur);
      });
      cy.task('log', `saisie formulaire`);
      cy.task('log', `recherche`);
      cy.get('#bouton-recherche').click();
      cy.wait(500);
      cy.injectAxe();
      cy.checkA11y(excludeAxe, rulesAxe, violation, skipFailure);
      cy.task('log', `fin Le résultat ${proprietaire.nom} ne contient pas de défaut d'accessibilité`);
    });
    it(`La modale partage ${proprietaire.nom} ne contient pas de défaut d'accessibilité`, () => {
      cy.task('log', `début La modale partage ${proprietaire.nom} ne contient pas de défaut d'accessibilité`);
      cy.get('a.fr-nav__link').contains("Propriétaire").click();
      cy.task('log', `clik onglet proprietaire`);
      cy.get(proprietaire.bouton).should('exist').click();
      cy.task('log', `clik tab ${proprietaire.tab}`);
      cy.get('li:has(' + proprietaire.tab + ')').click();
      cy.get('#bouton-effacer').click();
      proprietaire.champs.forEach((champ) => {
        cy.get(champ.nom).type(champ.valeur);
      });
      cy.task('log', `saisie formulaire`);
      cy.task('log', `recherche`);
      cy.get('#bouton-recherche').click();
      cy.wait(1000);
      cy.get('.fr-btn--secondary').click();
      cy.task('log', `click partage`);
      cy.injectAxe();
      cy.checkA11y(excludeAxe, rulesAxe, violation, skipFailure);
      cy.task('log', `fin La modale partage ${proprietaire.nom} ne contient pas de défaut d'accessibilité`);
    });
    proprietaire.tabsResultat.forEach((tab) => {
      it(`L'onglet ${tab} - ${proprietaire.nom} ne présente pas de défaut d'accessibilité`, () => {
        cy.task('log', `début L'onglet ${tab} - ${proprietaire.nom} ne présente pas de défaut d'accessibilité`);
        cy.get('a.fr-nav__link').contains("Propriétaire").click();
        cy.task('log', `click onglet proprietaire`);
        cy.get(proprietaire.bouton).should('exist').click();
        cy.task('log', `clik tab ${proprietaire.tab}`);
        cy.get('li:has(' + proprietaire.tab + ')').click();
        cy.get('#bouton-effacer').click();
        proprietaire.champs.forEach((champ) => {
          cy.get(champ.nom).type(champ.valeur);
        });
        cy.task('log', `saisie formulaire`);
        cy.task('log', `recherche`);
        cy.get('#bouton-recherche').click();
        cy.wait(1000);
        cy.task('log', `click onglet resultat`);
        cy.get('li:has(' + tab + ')').click();
        cy.injectAxe();
        cy.checkA11y(excludeAxe, rulesAxe, violation, skipFailure);
        cy.task('log', `fin L'onglet ${tab} - ${proprietaire.nom} ne présente pas de défaut d'accessibilité`);
      });
    });
  });

  onglets.forEach((onglet) => {
    it(`La page ${onglet} ne contient pas de défaut d'accessibilité`, () => {
      cy.task('log', `début La page ${onglet} ne contient pas de défaut d'accessibilité`);
      cy.get('a.fr-nav__link').contains(onglet).click();
      cy.wait(50);
      cy.injectAxe();
      cy.checkA11y(excludeAxe, rulesAxe, violation, skipFailure);
      cy.task('log', `fin La page ${onglet} ne contient pas de défaut d'accessibilité`);
    });
  });
})
