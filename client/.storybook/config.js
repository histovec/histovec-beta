/* eslint-disable import/no-extraneous-dependencies */
import { addParameters, configure } from '@storybook/vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import '@/assets/scss/_style.scss'
import '@/assets/scss/bleu_vert.scss'
import '@/assets/scss/style.scss'

const viewport = {
  defaultViewport: 'iphone6'
}

addParameters({ viewport });

import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import '@/assets/scss/_style.scss'
import '@/assets/scss/bleu_vert.scss'
import '@/assets/scss/style.scss'

const req = require.context('../src', true, /.stories.js$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
