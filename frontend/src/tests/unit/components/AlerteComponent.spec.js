import { mount } from '@vue/test-utils'
import AlerteComponent from '@Components/AlerteComponent.vue'
import { describe, it, expect } from 'vitest'

describe('AlerteComponent', () => {
  it('Doit afficher une alerte correctement avec les bonnes props', () => {
    const wrapper = mount(AlerteComponent, { props: {
        titre: 'Titre de test',
        description: 'Descripition de test',
        isAlerteOpened: true,
        small: false,
        type: 'success',
      } })

    const div = wrapper.find('div');
    const dsfrAlert = div.find('dsfralert');

    expect(div.attributes().class).toBe('container-alerts__Sticky');
    expect(dsfrAlert.attributes().title).toBe(wrapper.vm.titre);
    expect(dsfrAlert.attributes().description).toBe(wrapper.vm.description);
    expect(dsfrAlert.attributes().small).toBe(wrapper.vm.small.toString());
    expect(dsfrAlert.attributes().type).toBe(wrapper.vm.type.toString());
    expect(dsfrAlert.attributes().closeable).exist;
    expect(dsfrAlert.element._vei.onClose.value).exist;
  })

  it('Doit répondre correctement a la fermeture', async () => {
    const wrapper = mount(AlerteComponent, { props: {
        titre: 'Titre de test',
        description: 'Descripition de test',
        isAlerteOpened: true,
        small: false,
        type: 'success',
      } })

    await new Promise((r) => setTimeout(r, 5500));
    expect(wrapper.emitted().close).exist
  })

  it('Doit répondre correctement a la fermeture', () => {
    const wrapper = mount(AlerteComponent, { props: {
        titre: 'Titre de test',
        description: 'Descripition de test',
        isAlerteOpened: true,
        small: false,
        type: 'success',
      } })

    const dsfrAlert = wrapper.find('div').find('dsfralert');

    expect(dsfrAlert.attributes().closeable).exist;
    expect(dsfrAlert.element._vei.onClose.value).exist;

    wrapper.vm.fermerAlerte()
    expect(wrapper.emitted().close).exist
  })
})
