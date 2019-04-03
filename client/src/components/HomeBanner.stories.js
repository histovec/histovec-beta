import { storiesOf } from '@storybook/vue'

import HomeBanner from './HomeBanner'

storiesOf('Home', module)
  .add('HomeBanner', () => ({
    components: { HomeBanner },
    template: '<home-banner />'
  }))
