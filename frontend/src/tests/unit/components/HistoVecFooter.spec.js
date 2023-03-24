import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HistoVecFooter from '../../../components/HistoVecFooter.vue'

describe('HistoVecFooter', () => {
  it('Doit afficher le footer avec les bonnes informations', () => {
    const wrapper = mount(HistoVecFooter, {})
    const footer = wrapper.find('dsfrfooter');

    expect(footer.exists()).true;
    expect(footer.attributes()['logo-text']).toBe('Ministère,de l’intérieur');
    expect(footer.attributes()['home-link']).toBe('/accueil');
    expect(footer.attributes()['operator-link-text']).toBe('Logo HistoVec');
    expect(footer.attributes()['operator-to']).toBe('/accueil');
    expect(footer.attributes()['operator-img-src']).toBe('/src/assets/img/logo_histovec_simple.svg');
    expect(footer.attributes()['operator-img-alt']).toBe('Logo HistoVec');
    expect(footer.attributes()['licence-text']).toBe('Sauf mention contraire, tous les contenus de ce site sont sous ');
    expect(footer.attributes()['licence-to']).toBe('https://github.com/etalab/licence-ouverte/blob/master/LO.md');
    expect(footer.attributes()['licence-name']).toBe('licence etalab-2.0');
  })
})
