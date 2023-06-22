import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TitrePresentationPage from '@Components/TitrePresentationPage.vue'

describe('TitrePresentationPage', () => {
  it('Doit afficher une entete de presentation de la page', () => {
    const id = 'id-image';
    const src = 'src-image';
    const titre = 'titre de présentation';
    const sousTitre = 'sousTitre de présentation';
    const description = 'descritpion de présentation';

    const wrapper = mount(TitrePresentationPage, { props: {
        id: id,
        src: src,
        titre: titre,
        sousTitre: sousTitre,
        description: description,
      } })

    const divStructure = wrapper.findAll('div');
    expect(divStructure.length).toBe(3);

    const divImage = divStructure[0];
    expect(divImage.classes('fr-col-lg-4')).true;
    const divTitre = divStructure[2];
    expect(divTitre.classes('fr-col-12')).true;

    const h1 = divTitre.find('h1');
    expect(h1.exists()).true;
    expect(h1.text()).toBe(wrapper.vm.titre);
    const h2 = divTitre.find('h2');
    expect(h2.exists()).true;
    expect(h2.text()).toBe(wrapper.vm.sousTitre);
    const p = divTitre.find('p');
    expect(p.exists()).true;
    expect(p.classes('fr-text--xl')).true;
    expect(p.text()).toBe(wrapper.vm.description);
  })
})
