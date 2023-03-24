import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import CarteDsfrNonCliquable from '../../../components/CarteDsfrNonCliquable.vue';
import simpleSvg from '@/assets/img/simple.svg?url'

describe('CarteDsfrNonCliquable', () => {
  it('Doit afficher une carte sans un id donné', () => {
    const wrapper = mount(CarteDsfrNonCliquable, { props: {
        titre: 'Titre de la carte',
        description: 'Descripition de la carte',
        image: simpleSvg,
      } })

    const div = wrapper.find('div');
    expect(div.attributes().id).toBe('carte-titre-de-la-carte');
  })
  it('Doit afficher une carte sans alt donné', () => {
    const wrapper = mount(CarteDsfrNonCliquable, { props: {
        id: 'id-carte',
        titre: 'Titre de la carte',
        description: 'Descripition de la carte',
        image: simpleSvg,
      } })

    const image = wrapper.find('img');
    expect(image.attributes().alt).undefined;
  })
  it('Doit afficher une carte correctement', () => {
    const wrapper = mount(CarteDsfrNonCliquable, { props: {
        id: 'id-carte',
        titre: 'Titre de la carte',
        description: 'Descripition de la carte',
        alt: 'image carte',
        image: simpleSvg,
      } })

    const divs = wrapper.findAll('div');
    expect(divs.length).toBe(3);
    expect(divs[0].attributes().class).toBe('fr-card fr-card--no-arrow');

    const divBody = divs[1];
    const divImage = divs[2];
    expect(divBody.attributes().class).toBe('fr-card__body');
    expect(divImage.attributes().class).toBe('fr-card__img');

    const h4 = divBody.find('h4');
    expect(h4.attributes().class).toBe('fr-card__title');

    const span = divBody.find('span');
    expect(span.text()).toBe(wrapper.vm.titre);

    const p = divBody.find('p');
    expect(p.attributes().class).toBe('fr-card__desc');
    expect(p.text()).toBe(wrapper.vm.description);

    const image = divImage.find('img');
    expect(image.attributes().class).toBe('fr-responsive-img');
    expect(image.attributes().src).toBe('/src/assets/img/simple.svg');
    expect(image.attributes().alt).toBe('image carte');
  })
})
