import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HistoVecModale from '../../../components/HistoVecModale.vue'

describe('HistoVecModale', () => {
  it('Ne doit pas afficher la modale', () => {
    const titre = 'Titre de la modale';
    const boutonsActions = [];
    const isOpened = false;

    const wrapper = mount(HistoVecModale, { props: {
        titre: titre,
        actions: boutonsActions,
        opened: isOpened,
      } })

    const dialog = wrapper.find('dialog');
    expect(dialog.exists()).false;
  })
  it('Doit afficher une modale ouverte', () => {
    const titre = 'Titre de la modale';
    const boutonsActions = [];
    const isOpened = true;

    const wrapper = mount(HistoVecModale, { props: {
        titre: titre,
        actions: boutonsActions,
        opened: isOpened,
      } })

    const dialog = wrapper.find('dialog');

    expect(dialog.exists()).true;
    expect(dialog.attributes().id).toBe('fr-modal-1');
    expect(dialog.attributes()['aria-labelledby']).toBe('fr-modal-title-modal-1');
    expect(dialog.attributes().class.includes('fr-modal')).true;
    expect(dialog.attributes().class.includes('fr-modal--opened')).true;
  })
  it('Doit emit la fonction close au clique sur le bouton de fermeture', async () => {
    const titre = 'Titre de la modale';
    const boutonsActions = [];
    const isOpened = true;

    const wrapper = mount(HistoVecModale, { props: {
        titre: titre,
        actions: boutonsActions,
        opened: isOpened,
      } })
    const button = wrapper.find('button');

    expect(button.exists()).true;
    await button.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('close');
    expect(wrapper.emitted().close.length).toBe(1);
  })
  it('Doit afficher le bon nombre de bouton', async () => {
    const titre = 'Titre de la modale';
    const boutonsActions = [
      {
        label: 'Envoyer le lien par mail',
        icon: 'ri-send-plane-fill',
        secondary: true,
        onClick: this.onClickMailLienPartage,
      },
      {
        label: 'Copier le lien',
        icon: 'ri-clipboard-line',
        onClick: this.onClickCopyLienPartage,
      },
    ];
    const isOpened = true;

    const wrapper = mount(HistoVecModale, { props: {
        titre: titre,
        actions: boutonsActions,
        opened: isOpened,
      } })
    const dsfrButtonGroup = wrapper.find('dsfrbuttongroup');

    expect(dsfrButtonGroup.exists()).true;
    expect(dsfrButtonGroup.attributes().buttons).toBe('[object Object],[object Object]');
  })
})
