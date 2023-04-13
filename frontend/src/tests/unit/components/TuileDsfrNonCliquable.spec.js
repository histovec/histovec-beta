import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TuileDsfrNonCliquable from '../../../components/TuileDsfrNonCliquable.vue';

describe('TuileDsfrNonCliquable', () => {
  it('Doit afficher une tuile avec le bon titre', () => {
    const titreText = 'Titre test';

    const wrapper = mount(TuileDsfrNonCliquable, { props: {
        titre: titreText,
      } })

    const divTuile = wrapper.find('div');
    const loaderComponent = divTuile.find('loadercomponent');
    const divTuileBody = divTuile.find('div');
    const titre = divTuileBody.find('h3');
    const lien = titre.find('span');
    const description = divTuileBody.find('div');

    expect(divTuile.attributes().class.includes('fr-tile')).true;
    expect(divTuile.attributes().class.includes('fr-enlarge')).true;
    expect(divTuile.attributes().class.includes('fr-tile--horizontal')).true;
    expect(loaderComponent.exists()).false;
    expect(divTuileBody.attributes().class.includes('fr-tile__body')).true;
    expect(titre.attributes().class.includes('fr-tile__title')).true;
    expect(lien.attributes().class.includes('fr-tile__link')).true;
    expect(lien.text()).toBe(titreText);
    expect(description.attributes().class.includes('fr-tile__desc')).true;
  })

  it('Doit afficher une tuile avec le bon titre et un loader', () => {
    const titreText = 'Titre test';

    const wrapper = mount(TuileDsfrNonCliquable, { props: {
        titre: titreText,
        isLoading: true,
      } })

    const divTuile = wrapper.find('div');
    const loaderComponent = divTuile.find('loadercomponent');
    const divTuileBody = divTuile.find('div');
    const titre = divTuileBody.find('h3');
    const lien = titre.find('span');
    const description = divTuileBody.find('div');

    expect(divTuile.attributes().class.includes('fr-tile')).true;
    expect(divTuile.attributes().class.includes('fr-enlarge')).true;
    expect(divTuile.attributes().class.includes('fr-tile--horizontal')).true;
    expect(loaderComponent.exists()).true;
    expect(loaderComponent.attributes().taille).toBe('md');
    expect(divTuileBody.attributes().class.includes('fr-tile__body')).true;
    expect(titre.attributes().class.includes('fr-tile__title')).true;
    expect(lien.attributes().class.includes('fr-tile__link')).true;
    expect(lien.text()).toBe(titreText);
    expect(description.attributes().class.includes('fr-tile__desc')).true;
  })
})
