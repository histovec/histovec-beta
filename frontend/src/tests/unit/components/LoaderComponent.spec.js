import { mount } from '@vue/test-utils'
import { describe, it, expect } from "vitest";
import LoaderComponent from "../../../components/LoaderComponent.vue";

describe('TuileDsfrNonCliquable', () => {
  it('Doit afficher le loader de taille par defaut - 1', () => {
    const wrapper = mount(LoaderComponent, {})

    const divContainer = wrapper.find('div');
    const divLoader = divContainer.find('div');

    expect(divContainer.attributes().class.includes('loader-container')).true;
    expect(divLoader.attributes().class.includes('lds-dual-ring')).true;
    expect(divLoader.attributes().class.includes('md')).false;
  })

  it('Doit afficher le loader de taille par par defaut - 2', () => {
    const wrapper = mount(LoaderComponent, { props: {
        taille: 'test',
      } })

    const divContainer = wrapper.find('div');
    const divLoader = divContainer.find('div');

    expect(divContainer.attributes().class.includes('loader-container')).true;
    expect(divLoader.attributes().class.includes('lds-dual-ring')).true;
    expect(divLoader.attributes().class.includes('md')).false;
  })

  it('Doit afficher le loader de taille par medium', () => {
    const wrapper = mount(LoaderComponent, { props: {
        taille: 'md',
      } })

    const divContainer = wrapper.find('div');
    const divLoader = divContainer.find('div');

    expect(divContainer.attributes().class.includes('loader-container')).true;
    expect(divLoader.attributes().class.includes('lds-dual-ring')).true;
    expect(divLoader.attributes().class.includes('md')).true;
  })
})
