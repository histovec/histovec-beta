import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HistoVecFooter from '../../../components/HistoVecFooter.vue'

describe('HistoVecFooter', () => {
  it('Doit afficher le footer avec les bonnes informations', () => {
    const contentLinks = [
      {
        label: 'legifrance.gouv.fr',
        href: 'https://legifrance.gouv.fr',
      },
      {
        label: 'gouvernement.fr',
        href: 'https://gouvernement.fr',
      },
      {
        label: 'service-public.fr',
        href: 'https://service-public.fr',
      },
      {
        label: 'data.gouv.fr',
        href: 'https://data.gouv.fr',
      },
      {
        label: 'interieur.gouv.fr',
        href: 'https://interieur.gouv.fr',
      },
      {
        label: 'securite-routiere.gouv.fr',
        href: 'https://securite-routiere.gouv.fr',
      },
      {
        label: 'immatriculation.ants.gouv.fr',
        href: 'https://immatriculation.ants.gouv.fr',
      },
    ]
    const mandatoryLinks = [
      {
        label: 'Plan du site',
        to: '/plan-du-site',
      },
      {
        label: 'Accessibilité : partiellement conforme',
        to: '/accessibilite',
      },
      {
        label: 'Mentions légales',
        to: '/mentions-legales',
      },
      {
        label: 'Données personnelles et Gestion des cookies',
        to: '/donnees-personnelles-et-cookies',
      },
    ]

    const wrapper = mount(HistoVecFooter, {})
    const footer = wrapper.find('footer');
    expect(footer.exists()).true;
    expect(footer.classes('fr-footer')).true;

    const divContainer = wrapper.find('div');
    expect(divContainer.classes('fr-container')).true;

    const divStructure = divContainer.findAll('div');
    expect(divStructure.length).toBe(8);

    // test body
    const body = divStructure[0];
    expect(body.classes('fr-footer__body')).true;
    const bodyDivs = body.findAll('div');
    expect(bodyDivs.length).toBe(2);

    expect(bodyDivs[0].attributes().class).toBe('fr-footer__brand fr-enlarge-link background-default-white');
    const logo = bodyDivs[0].find('p');
    expect(logo.classes('fr-logo')).true;
    expect(logo.text()).toBe('Ministère de l’intérieur et des outre-mer');
    const routerLink = bodyDivs[0].find('router-link');
    expect(routerLink.attributes().class).toBe('fr-footer__brand-link');
    expect(routerLink.attributes().to).toBe('/');
    expect(routerLink.attributes().title).toBe('Ministère de l’intérieur et des outre-mer - HistoVec - Retour à l’accueil du site');
    const img = routerLink.find('img');
    expect(img.attributes().class).toBe('fr-footer__logo footer__logo__histovec');
    expect(img.attributes().alt).toBe('');

    expect(bodyDivs[1].classes('fr-footer__content')).true;
    const descriptions = bodyDivs[1].findAll('p');
    expect(descriptions.length).toBe(2);
    expect(descriptions[0].classes('fr-footer__content-desc')).true;
    expect(descriptions[0].text()).toBe('HistoVec : un service proposé par la délégation à la sécurité routière.');
    expect(descriptions[1].classes('fr-footer__content-desc')).true;
    expect(descriptions[1].text()).toBe('Jouez la transparence : partagez l\'historique de votre véhicule.');
    const contentListUl = bodyDivs[1].find('ul');
    expect(contentListUl.classes('fr-footer__content-list')).true;
    const contentListLi = contentListUl.findAll('li');
    expect(contentListLi.length).toBe(7);

    contentListLi.forEach((element, index) => {
      expect(element.classes('fr-footer__content-item')).true;
      const elementA = element.find('a');
      expect(elementA.attributes().class).toBe('fr-footer__content-link');
      expect(elementA.attributes().target).toBe('_blank');
      expect(elementA.attributes().href).toBe(contentLinks[index].href);
      expect(elementA.text()).toBe(contentLinks[index].label);
    });

    // test partenaires
    const partenaires = divStructure[3];
    expect(partenaires.classes('fr-footer__partners')).true;

    const partenaireTitre = partenaires.find('span');
    expect(partenaireTitre.attributes().class).toBe('fr-footer__partners-title');
    expect(partenaireTitre.text()).toBe('Nos partenaires');

    const partenaireLogo = partenaires.find('div');
    expect(partenaireLogo.attributes().class).toBe('fr-footer__partners-logos');

    const partenaireMain = partenaireLogo.find('div');
    expect(partenaireMain.attributes().class).toBe('fr-footer__partners-main background-default-white');
    const elementA = partenaireMain.find('a');
    expect(elementA.attributes().class).toBe('fr-footer__partners-link');
    expect(elementA.attributes().id).toBe('securiteRoutiereIconeImage');
    expect(elementA.attributes().rel).toBe('noopener noreferrer');
    expect(elementA.attributes().target).toBe('_blank');
    expect(elementA.attributes().href).toBe('https://securite-routiere.gouv.fr');
    expect(elementA.attributes().title).toBe('Securité routière - Lien vers le site securite-routiere.gouv.fr');
    const imgPartnaire = elementA.find('img');
    expect(imgPartnaire.attributes().class).toBe('fr-footer__logo footer__logo__securiteRoutiere');
    expect(imgPartnaire.attributes().alt).toBe('');

    // test bottom
    const bottom = divStructure[6];
    expect(bottom.classes('fr-footer__bottom')).true;

    const bottomUl = bottom.find('ul');
    expect(bottomUl.attributes().class).toBe('fr-footer__bottom-list');
    const bottomLi = bottomUl.findAll('li');
    expect(bottomLi.length).toBe(4);
    bottomLi.forEach((element, index) => {
      expect(element.attributes().class).toBe('fr-footer__bottom-item');
      const elementA = element.find('router-link');
      expect(elementA.attributes().class).toBe('fr-footer__bottom-link');
      expect(elementA.attributes().to).toBe(mandatoryLinks[index].to);
      expect(elementA.text()).toBe(mandatoryLinks[index].label);
    });

    const bottomCopy = bottom.find('div');
    expect(bottomCopy.attributes().class).toBe('fr-footer__bottom-copy');
    const bottomCopyP = bottom.find('p');
    expect(bottomCopyP.text()).toBe('Sauf mention contraire, tous les contenus de ce site sont sous licence etalab-2.0');
    const bottomCopyA = bottomCopyP.find('a');
    expect(bottomCopyA.attributes().href).toBe('https://github.com/etalab/licence-ouverte/blob/master/LO.md');
    expect(bottomCopyA.attributes().target).toBe('_blank');
    expect(bottomCopyA.text()).toBe('licence etalab-2.0');
  })
})
