import Vue from 'vue'
import Router from 'vue-router'

import * as ROUTES_NAMES from '../router/constants/routesNames'

import Home from '@/components/Home'
import Search from '@/components/Search'
import Report from '@/components/Report'
import Faq from '@/components/infos/Faq'
import Legal from '@/components/infos/Legal'
import Buyer from '@/components/infos/Buyer'
import NotFound from '@/components/infos/NotFound'

import Synthesis from '../components/reportParts/Synthesis.vue'
import Vehicle from '../components/reportParts/Vehicle.vue'
import Holder from '../components/reportParts/Holder.vue'
import AdministrativeStatus from '../components/reportParts/AdministrativeStatus.vue'
import History from '../components/reportParts/History.vue'
import TechnicalControl from '../components/reportParts/TechnicalControl.vue'
import KilometersGraph from '../components/reportParts/KilometersGraph.vue'
import AdministrativeCertificate from '../components/reportParts/AdministrativeCertificate.vue'
import Share from '../components/reportParts/Share.vue'

Vue.use(Router)

const BASE_ROUTE = '/histovec'

// @todo : Ajouter du lazy-loading pour les composants des routes
// A faire après le passage à vue-cli-3
export default new Router({
  mode: 'history',
  routes: [
    {
      name: ROUTES_NAMES.ROOT,
      path: BASE_ROUTE,
      redirect: { name: ROUTES_NAMES.HOME },
      meta: { title: 'Histovec - Accueil' },
    },
    {
      name: ROUTES_NAMES.HOME,
      path: `${BASE_ROUTE}/home`,
      component: Home,
      meta: { title: 'Histovec - Accueil' },
    },
    {
      name: ROUTES_NAMES.SEARCH,
      path: `${BASE_ROUTE}/search`,
      component: Search,
      meta: { title: 'Histovec - Recherche' },
    },
    {
      name: ROUTES_NAMES.REPORT,
      path: `${BASE_ROUTE}/report`,
      redirect: { name: ROUTES_NAMES.SYNTHESIS },
      component: Report,
      meta: { title: 'Histovec - Rapport' },
      children: [
        {
          name: ROUTES_NAMES.SYNTHESIS,
          path: 'synthesis',
          component: Synthesis,
          meta: { title: 'Histovec - Rapport - Synthèse' },
        },
        {
          name: ROUTES_NAMES.VEHICLE,
          path: 'vehicle',
          component: Vehicle,
          meta: { title: 'Histovec - Rapport - Caractéristiques techniques' },
        },
        {
          name: ROUTES_NAMES.HOLDER,
          path: 'holder',
          component: Holder,
          meta: { title: 'Histovec - Rapport - Titulaire et titre' },
        },
        {
          name: ROUTES_NAMES.ADMINISTRATIVE_STATUS,
          path: 'administrative-status',
          component: AdministrativeStatus,
          meta: { title: 'Histovec - Rapport - Situation administrative' },
        },
        {
          name: ROUTES_NAMES.HISTORY,
          path: 'history',
          component: History,
          meta: { title: 'Histovec - Rapport - Historique' },
        },
        {
          name: ROUTES_NAMES.TECHNICAL_CONTROL,
          path: 'technical-control',
          component: TechnicalControl,
          meta: { title: 'Histovec - Rapport - Contrôle technique' },
        },
        {
          name: ROUTES_NAMES.KILOMETERS,
          path: 'kilometers',
          component: KilometersGraph,
          meta: { title: 'Histovec - Rapport - Kilométrage' },
        },
        // @todo: Fusionner 'csa' dans 'administrativeCertificate'
        {
          name: ROUTES_NAMES.CSA,
          path: 'csa',
          component: AdministrativeCertificate,
          meta: { title: 'Histovec - Rapport - Certificat administratif' },
        },
        {
          name: ROUTES_NAMES.SHARE,
          path: 'share',
          component: Share,
          meta: { title: 'Histovec - Rapport - Partager' },
        },
      ],
    },
    {
      name: ROUTES_NAMES.FAQ,
      path: `${BASE_ROUTE}/faq`,
      component: Faq,
      meta: { title: 'Histovec - FAQ' },
    },
    {
      name: ROUTES_NAMES.LEGAL,
      path: `${BASE_ROUTE}/legal`,
      component: Legal,
      meta: { title: 'Histovec - Mentions Légales' },
    },
    {
      name: ROUTES_NAMES.BUYER,
      path: `${BASE_ROUTE}/buyer`,
      component: Buyer,
      meta: { title: 'Histovec - Acheteur' },
    },
    {
      name: ROUTES_NAMES.NOT_FOUND,
      path: `${BASE_ROUTE}/*`,
      component: NotFound,
      meta: { title: 'Histovec - Page non trouvée' },
    },
  ],
})
