import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ImagePresentation from '../../../components/ImagePresentation.vue'

describe('ImagePresentation', () => {
  it('Doit afficher une image avec les bonnes informations', () => {
    const id = 'id-image';
    const alt = 'alt-image';
    const src = 'src-image';

    const wrapper = mount(ImagePresentation, { props: {
        id: id,
        alt : alt,
        src: src,
      } })

    const divContentMedia = wrapper.find('div');
    const image = divContentMedia.find('img');

    expect(divContentMedia.attributes().class.includes('fr-content-media')).true;
    expect(image.exists()).true;
    expect(image.attributes().id).toBe(id);
    expect(image.attributes().alt).toBe(alt);
    expect(image.attributes().src).toBe(src);
    expect(image.attributes().class.includes('fr-responsive-img')).true;
    expect(image.attributes().class.includes('image-presentation__format')).true;
  })
})
