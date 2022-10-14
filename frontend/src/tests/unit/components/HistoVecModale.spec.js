import { mount } from '@vue/test-utils'
import { describe, it, expect } from "vitest";
import HistoVecModale from "../../../components/HistoVecModale.vue";

describe('HistoVecModale', () => {
  it('Doit afficher une modale avec les bonnes informations', () => {
    const titre = 'Titre de la modale';
    const boutonsActions = [];
    const isOpened = false;

    const wrapper = mount(HistoVecModale, { props: {
        titre: titre,
        actions: boutonsActions,
        opened: isOpened,
      } })

    const dialog = wrapper.find('dialog');
    const divContainer = dialog.find('div');
    const divGrid = divContainer.find('div');
    const divCol = divGrid.find('div');
    const divBody = divCol.find('div');
    const divContents = divBody.findAll('div');

    const divHeader = divContents[0];
    const divContent = divContents[1];
    const divFooter = divContents[2];

    const button = divHeader.find('button');
    const h1 = divContent.find('h1');
    const dsfrButtonGroup = divFooter.find('dsfrbuttongroup');

    expect(dialog.exists()).true;
    expect(dialog.attributes().id).toBe('fr-modal-1');
    expect(dialog.attributes()['aria-labelledby']).toBe('fr-modal-title-modal-1');
    expect(dialog.attributes().class.includes('fr-modal')).true;
    expect(dialog.attributes().class.includes('fr-modal--opened')).false;

    expect(divContainer.exists()).true;
    expect(divContainer.attributes().class.includes('fr-container')).true;
    expect(divContainer.attributes().class.includes('fr-container--fluid')).true;
    expect(divContainer.attributes().class.includes('fr-container-md')).true;

    expect(divGrid.exists()).true;
    expect(divGrid.attributes().class.includes('fr-grid-row')).true;
    expect(divGrid.attributes().class.includes('fr-grid-row--center')).true;

    expect(divCol.exists()).true;
    expect(divCol.attributes().class.includes('fr-col-12')).true;
    expect(divCol.attributes().class.includes('fr-col-md-8')).true;
    expect(divCol.attributes().class.includes('fr-col-lg-6')).true;

    expect(divBody.exists()).true;
    expect(divBody.attributes().class.includes('fr-modal__body')).true;

    expect(divHeader.exists()).true;
    expect(divHeader.attributes().class.includes('fr-modal__header')).true;

    expect(divContent.exists()).true;
    expect(divContent.attributes().class.includes('fr-modal__content')).true;

    expect(divFooter.exists()).true;
    expect(divFooter.attributes().class.includes('fr-modal__footer')).true;

    expect(button.exists()).true;
    expect(button.attributes().class.includes('fr-btn')).true;
    expect(button.attributes().class.includes('fr-btn--close')).true;
    expect(button.attributes()['aria-controls'].includes('fr-modal-1')).true;
    expect(button.attributes().title).toBe('Fermer la fenêtre modale');
    expect(button.attributes().role).toBe('button');
    expect(button.text()).toBe('Fermer');

    expect(h1.exists()).true;
    expect(h1.attributes().class.includes('fr-modal__title')).true;
    expect(h1.attributes().id).toBe('fr-modal-title-modal-1');
    expect(h1.text()).toBe(titre);

    expect(dsfrButtonGroup.exists()).true;
    expect(dsfrButtonGroup.attributes().align).toBe('right');
    expect(dsfrButtonGroup.attributes().inline).toBe('');
    expect(dsfrButtonGroup.attributes().reverse).toBe('');
    expect(dsfrButtonGroup.attributes().buttons).toBe('');
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
    await button.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("close");
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
