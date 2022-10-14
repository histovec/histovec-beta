import { mount } from '@vue/test-utils'
import AccueilPage from '../../../views/AccueilPage.vue'
import { describe, it, expect } from "vitest";

describe('AccueilPage', () => {
  it("Doit afficher une la page d'accueil", () => {
    const wrapper = mount(AccueilPage, {});

    // Breadcrumb
    const breadcrumb = wrapper.find('dsfrbreadcrumb');
    expect(breadcrumb.exists()).toBe(true);
    expect(breadcrumb.attributes().class).toBe('fr-mb-0');
    expect(breadcrumb.attributes().links).exist;

    // Titre
    const titre = wrapper.get('h1');
    expect(titre.text()).toBe("Partagez l'historique de votre véhicule");

    // sous-titres h2
    const soustitresh2 = wrapper.findAll('h2');
    expect(soustitresh2.length).toBe(3);
    expect(soustitresh2[0].text()).toBe('Jouez la transparence');
    expect(soustitresh2[1].text()).toBe('Nos garanties');
    expect(soustitresh2[2].text()).toBe('Propriétaire ou Acheteur ?');

    // sous-titres h4
    const soustitresh4 = wrapper.findAll('h4');
    expect(soustitresh4.length).toBe(4);
    expect(soustitresh4[0].text()).toBe('Simple');
    expect(soustitresh4[1].text()).toBe('Officiel');
    expect(soustitresh4[2].text()).toBe('Confidentiel');
    expect(soustitresh4[3].text()).toBe('Gratuit');

    // paragraphes
    const paragraphes = wrapper.findAll('p');
    expect(paragraphes.length).toBe(7);
    expect(paragraphes[0].text()).toBe("Vous souhaitez vendre votre véhicule ? Vous avez fait une sélection de véhicules parmi des annonces ? Partagez ou consultez l'historique du véhicule.");
    expect(paragraphes[5].text()).toBe('Propriétaire, générez le rapport.');
    expect(paragraphes[6].text()).toBe('Acheteur, demandez-le au vendeur.');

    // cartes
    const carteSimple = wrapper.find("#carte-simple");
    expect(carteSimple.exists()).true;
    expect(carteSimple.find('h4').text()).toBe('Simple');
    expect(carteSimple.find('p').text()).toBe('En 3 étapes seulement : Identifiez-vous, générez le rapport et partagez-le!');
    const carteSimpleImage = carteSimple.findAll('img')[0];
    expect(carteSimpleImage.exists()).true;
    expect(carteSimpleImage.attributes().src).toBe('/src/assets/img/simple.svg');

    const carteOfficiel = wrapper.find("#carte-officiel");
    expect(carteOfficiel.exists()).true;
    expect(carteOfficiel.find('h4').text()).toBe('Officiel');
    expect(carteOfficiel.find('p').text()).toBe("Données issues du Système d\'immatriculation des véhicules.");
    const carteOfficielImage = carteOfficiel.findAll('img')[0];
    expect(carteOfficielImage.exists()).true;
    expect(carteOfficielImage.attributes().src).toBe('/src/assets/img/officiel.svg');

    const carteConfidentiel = wrapper.find("#carte-confidentiel");
    expect(carteConfidentiel.exists()).true;
    expect(carteConfidentiel.find('h4').text()).toBe('Confidentiel');
    expect(carteConfidentiel.find('p').text()).toBe('Seul le propriétaire peut partager ses informations.');
    const carteConfidentielImage = carteConfidentiel.findAll('img')[0];
    expect(carteConfidentielImage.exists()).true;
    expect(carteConfidentielImage.attributes().src).toBe('/src/assets/img/confidentiel.svg');

    const carteGratuit = wrapper.find("#carte-gratuit");
    expect(carteGratuit.exists()).true;
    expect(carteGratuit.find('h4').text()).toBe('Gratuit');
    expect(carteGratuit.find('p').text()).toBe('Un service gratuit pour les propriétaires et les acheteurs.');
    const carteGratuitImage = carteGratuit.findAll('img')[0];
    expect(carteGratuitImage.exists()).true;
    expect(carteGratuitImage.attributes().src).toBe('/src/assets/img/gratuit.svg');

    // DsfrTile

    const tuiles = wrapper.findAll('dsfrtile');
    expect(tuiles.length).toBe(2);

    const tuileProprietaire = tuiles[0]
    expect(tuileProprietaire.attributes().title).toBe('Propriétaire');
    expect(tuileProprietaire.attributes().description).toBe('Rassurez vos acheteurs potentiels avec le rapport et obtenez votre certificat de non gage.');
    expect(tuileProprietaire.attributes().to).toBe('/proprietaire');
    expect(tuileProprietaire.attributes().imgsrc).toBe('');
    expect(tuileProprietaire.attributes().horizontal).toBe('true');

    const tuileAcheteur = tuiles[1]
    expect(tuileAcheteur.attributes().title).toBe('Acheteur');
    expect(tuileAcheteur.attributes().description).toBe('Achetez en confiance : demandez le rapport au vendeur.');
    expect(tuileAcheteur.attributes().to).toBe('/acheteur');
    expect(tuileAcheteur.attributes().imgsrc).toBe('');
    expect(tuileAcheteur.attributes().horizontal).toBe('true');

    // boutons
    const boutons = wrapper.findAll('histovecbuttonlink');
    expect(boutons.length).toBe(2);

    const boutonBesoinAide = boutons[0];
    expect(boutonBesoinAide.attributes().label).toBe("Besoin d'aide");
    expect(boutonBesoinAide.attributes().icon).toBe('ri-question-line');
    expect(boutonBesoinAide.attributes().to).toBe('/faq');
    expect(boutonBesoinAide.attributes().secondary).toBe(undefined);

    const boutonContactezNous = boutons[1];
    expect(boutonContactezNous.attributes().label).toBe("Contactez-nous");
    expect(boutonContactezNous.attributes().icon).toBe('ri-mail-line');
    expect(boutonContactezNous.attributes().to).toBe('/contact');
    expect(boutonContactezNous.attributes().secondary).exist;
  })
})
