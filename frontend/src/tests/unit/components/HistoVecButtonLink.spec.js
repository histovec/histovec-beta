import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HistoVecButtonLink from '../../../components/HistoVecButtonLink.vue'

describe('HistoVecButtonLink', () => {
  it('Doit afficher un router link avec "to" étant une string et les props par defaut', () => {
    const url = '/url';
    const label = 'Label test';

    const wrapper = mount(HistoVecButtonLink, { props: {
        to: '/url',
        label: label,
      } })

    const routreLink = wrapper.find('router-link');
    const dsfrbutton = wrapper.find('dsfrbutton');

    expect(routreLink.exists()).true;
    expect(dsfrbutton.exists()).true;
    expect(wrapper.find('a').exists()).false;
    expect(routreLink.attributes().to).toBe(url);
    expect(routreLink.attributes().replace).toBe('false');
    expect(routreLink.attributes().custom).toBe('false');
    expect(routreLink.attributes().ariacurrentvalue).toBe('page');
    expect(dsfrbutton.attributes().disabled).toBe('false');
    expect(dsfrbutton.attributes().label).toBe(label);
    expect(dsfrbutton.attributes().secondary).toBe('false');
    expect(dsfrbutton.attributes().tertiary).toBe('false');
    expect(dsfrbutton.attributes().icon).undefined;
    expect(dsfrbutton.attributes().iconright).toBe('false');
    expect(dsfrbutton.attributes().icononly).toBe('false');
  })

  it('Doit afficher un router link avec une icone', () => {
    const url = '/url';
    const label = 'Label test';
    const icone = 'ri-question-line';

    const wrapper = mount(HistoVecButtonLink, { props: {
        to: '/url',
        label: label,
        icon: icone,
      } })

    const routreLink = wrapper.find('router-link');
    const dsfrbutton = wrapper.find('dsfrbutton');

    expect(routreLink.exists()).true;
    expect(dsfrbutton.exists()).true;
    expect(wrapper.find('a').exists()).false;
    expect(routreLink.attributes().to).toBe(url);
    expect(routreLink.attributes().replace).toBe('false');
    expect(routreLink.attributes().custom).toBe('false');
    expect(routreLink.attributes().ariacurrentvalue).toBe('page');
    expect(dsfrbutton.attributes().disabled).toBe('false');
    expect(dsfrbutton.attributes().label).toBe(label);
    expect(dsfrbutton.attributes().secondary).toBe('false');
    expect(dsfrbutton.attributes().tertiary).toBe('false');
    expect(dsfrbutton.attributes().icon).toBe(icone);
    expect(dsfrbutton.attributes().iconright).toBe('false');
    expect(dsfrbutton.attributes().icononly).toBe('false');
  })

  it('Doit afficher un router link avec une icone à droite', () => {
    const url = '/url';
    const label = 'Label test';
    const icone = 'ri-question-line';

    const wrapper = mount(HistoVecButtonLink, { props: {
        to: '/url',
        label: label,
        icon: icone,
        iconRight: true,
      } })

    const routreLink = wrapper.find('router-link');
    const dsfrbutton = wrapper.find('dsfrbutton');

    expect(routreLink.exists()).true;
    expect(dsfrbutton.exists()).true;
    expect(wrapper.find('a').exists()).false;
    expect(routreLink.attributes().to).toBe(url);
    expect(routreLink.attributes().replace).toBe('false');
    expect(routreLink.attributes().custom).toBe('false');
    expect(routreLink.attributes().ariacurrentvalue).toBe('page');
    expect(dsfrbutton.attributes().disabled).toBe('false');
    expect(dsfrbutton.attributes().label).toBe(label);
    expect(dsfrbutton.attributes().secondary).toBe('false');
    expect(dsfrbutton.attributes().tertiary).toBe('false');
    expect(dsfrbutton.attributes().icon).toBe(icone);
    expect(dsfrbutton.attributes().iconright).toBe('true');
    expect(dsfrbutton.attributes().icononly).toBe('false');
  })

  it('Doit afficher un router link avec uniquement une icone', () => {
    const url = '/url';
    const label = 'Label test';
    const icone = 'ri-question-line';

    const wrapper = mount(HistoVecButtonLink, { props: {
        to: '/url',
        label: label,
        icon: icone,
        iconOnly: true,
      } })

    const routreLink = wrapper.find('router-link');
    const dsfrbutton = wrapper.find('dsfrbutton');

    expect(routreLink.exists()).true;
    expect(dsfrbutton.exists()).true;
    expect(wrapper.find('a').exists()).false;
    expect(routreLink.attributes().to).toBe(url);
    expect(routreLink.attributes().replace).toBe('false');
    expect(routreLink.attributes().custom).toBe('false');
    expect(routreLink.attributes().ariacurrentvalue).toBe('page');
    expect(dsfrbutton.attributes().disabled).toBe('false');
    expect(dsfrbutton.attributes().label).toBe(label);
    expect(dsfrbutton.attributes().secondary).toBe('false');
    expect(dsfrbutton.attributes().tertiary).toBe('false');
    expect(dsfrbutton.attributes().icon).toBe(icone);
    expect(dsfrbutton.attributes().iconright).toBe('false');
    expect(dsfrbutton.attributes().icononly).toBe('true');
  })

  it('Doit afficher un router link en bouton secondaire et replace', () => {
    const url = '/url';
    const label = 'Label test';

    const wrapper = mount(HistoVecButtonLink, { props: {
        to: '/url',
        label: label,
        secondary: true,
        replace: true,
      } })

    const routreLink = wrapper.find('router-link');
    const dsfrbutton = wrapper.find('dsfrbutton');

    expect(routreLink.exists()).true;
    expect(dsfrbutton.exists()).true;
    expect(wrapper.find('a').exists()).false;
    expect(routreLink.attributes().to).toBe(url);
    expect(routreLink.attributes().replace).toBe('true');
    expect(routreLink.attributes().custom).toBe('false');
    expect(routreLink.attributes().ariacurrentvalue).toBe('page');
    expect(dsfrbutton.attributes().disabled).toBe('false');
    expect(dsfrbutton.attributes().label).toBe(label);
    expect(dsfrbutton.attributes().secondary).toBe('true');
    expect(dsfrbutton.attributes().tertiary).toBe('false');
    expect(dsfrbutton.attributes().icon).undefined;
    expect(dsfrbutton.attributes().iconright).toBe('false');
    expect(dsfrbutton.attributes().icononly).toBe('false');
  })

  it('Doit afficher un router link en bouton tertiaire et custom', () => {
    const url = '/url';
    const label = 'Label test';

    const wrapper = mount(HistoVecButtonLink, { props: {
        to: '/url',
        label: label,
        tertiary: true,
        custom: true,
      } })

    const routreLink = wrapper.find('router-link');
    const dsfrbutton = wrapper.find('dsfrbutton');

    expect(routreLink.exists()).true;
    expect(dsfrbutton.exists()).true;
    expect(wrapper.find('a').exists()).false;
    expect(routreLink.attributes().to).toBe(url);
    expect(routreLink.attributes().replace).toBe('false');
    expect(routreLink.attributes().custom).toBe('true');
    expect(routreLink.attributes().ariacurrentvalue).toBe('page');
    expect(dsfrbutton.attributes().disabled).toBe('false');
    expect(dsfrbutton.attributes().label).toBe(label);
    expect(dsfrbutton.attributes().secondary).toBe('false');
    expect(dsfrbutton.attributes().tertiary).toBe('true');
    expect(dsfrbutton.attributes().icon).undefined;
    expect(dsfrbutton.attributes().iconright).toBe('false');
    expect(dsfrbutton.attributes().icononly).toBe('false');
  })

  it('Doit afficher un router link disabled', () => {
    const url = '/url';
    const label = 'Label test';

    const wrapper = mount(HistoVecButtonLink, { props: {
        to: '/url',
        label: label,
        disabled: true,
      } })

    const routreLink = wrapper.find('router-link');
    const dsfrbutton = wrapper.find('dsfrbutton');

    expect(routreLink.exists()).true;
    expect(dsfrbutton.exists()).true;
    expect(wrapper.find('a').exists()).false;
    expect(routreLink.attributes().to).toBe(url);
    expect(routreLink.attributes().replace).toBe('false');
    expect(routreLink.attributes().custom).toBe('false');
    expect(routreLink.attributes().ariacurrentvalue).toBe('page');
    expect(dsfrbutton.attributes().disabled).toBe('true');
    expect(dsfrbutton.attributes().label).toBe(label);
    expect(dsfrbutton.attributes().secondary).toBe('false');
    expect(dsfrbutton.attributes().tertiary).toBe('false');
    expect(dsfrbutton.attributes().icon).undefined;
    expect(dsfrbutton.attributes().iconright).toBe('false');
    expect(dsfrbutton.attributes().icononly).toBe('false');
  })

  it('Doit afficher une balise <a> avec les classes css par defaut', () => {
    const url = 'http://url';
    const label = 'Label test';

    const wrapper = mount(HistoVecButtonLink, { props: {
        to: url,
        label: label,
        icon: 'ri-question-line',
      } })

    const baliseA = wrapper.find('a');
    const classCss = baliseA.attributes().class

    expect(wrapper.find('router-link').exists()).false;
    expect(baliseA.exists()).true;
    expect(baliseA.attributes().href).toBe(url);
    expect(baliseA.text()).toBe(label);
    expect(classCss.includes('fr-btn')).true;
    expect(classCss.includes('inline-flex')).true;
    expect(classCss.includes('fr-btn--secondary')).false;
    expect(classCss.includes('fr-btn--tertiary')).false;
    expect(classCss.includes('reverse')).false;
    expect(classCss.includes('justify-center')).false;
  })

  it('Doit afficher une balise <a> avec les classes css par defaut', () => {
    const url = 'http://url';
    const label = 'Label test';

    const wrapper = mount(HistoVecButtonLink, { props: {
        to: url,
        label: label,
        secondary: true,
        tertiary: true,
      } })

    const baliseA = wrapper.find('a');
    const classCss = baliseA.attributes().class

    expect(wrapper.find('router-link').exists()).false;
    expect(baliseA.exists()).true;
    expect(baliseA.attributes().href).toBe(url);
    expect(baliseA.text()).toBe(label);
    expect(classCss.includes('fr-btn')).true;
    expect(classCss.includes('inline-flex')).true;
    expect(classCss.includes('fr-btn--secondary')).false;
    expect(classCss.includes('fr-btn--tertiary')).false;
    expect(classCss.includes('reverse')).false;
    expect(classCss.includes('justify-center')).false;
  })

  it('Doit afficher une balise <a> en bouton secondaire', () => {
    const url = 'http://url';
    const label = 'Label test';

    const wrapper = mount(HistoVecButtonLink, { props: {
        to: url,
        label: label,
        secondary: true,
      } })

    const baliseA = wrapper.find('a');
    const classCss = baliseA.attributes().class

    expect(wrapper.find('router-link').exists()).false;
    expect(baliseA.exists()).true;
    expect(baliseA.attributes().href).toBe(url);
    expect(baliseA.text()).toBe(label);
    expect(classCss.includes('fr-btn')).true;
    expect(classCss.includes('inline-flex')).true;
    expect(classCss.includes('fr-btn--secondary')).true;
    expect(classCss.includes('fr-btn--tertiary')).false;
    expect(classCss.includes('reverse')).false;
    expect(classCss.includes('justify-center')).false;
  })

  it('Doit afficher une balise <a> en bouton tertiaire', () => {
    const url = 'http://url';
    const label = 'Label test';

    const wrapper = mount(HistoVecButtonLink, { props: {
        to: url,
        label: label,
        tertiary: true,
      } })

    const baliseA = wrapper.find('a');
    const classCss = baliseA.attributes().class

    expect(wrapper.find('router-link').exists()).false;
    expect(baliseA.exists()).true;
    expect(baliseA.attributes().href).toBe(url);
    expect(baliseA.text()).toBe(label);
    expect(classCss.includes('fr-btn')).true;
    expect(classCss.includes('inline-flex')).true;
    expect(classCss.includes('fr-btn--secondary')).false;
    expect(classCss.includes('fr-btn--tertiary')).true;
    expect(classCss.includes('reverse')).false;
    expect(classCss.includes('justify-center')).false;
  })
})
