<script>
import { defineComponent } from 'vue'

import logoHistoVec from '@/assets/img/_logo_histovec_simple.svg?url'

const RI_ICON_ATTRS = {
  scale: 0.9,
}

export default defineComponent({
  name: 'HistoVecHeader',

  data () {
    return {
      navItems: [
        {
          to: '/accueil',
          text: 'Accueil',
        },
        {
          to: '/proprietaire',
          text: 'Propriétaire',
        },
        {
          to: '/acheteur',
          text: 'Acheteur',
        },
        {
          to: '/faq',
          text: 'FAQ & Liens utiles',
        },
        {
          to: '/contact',
          text: 'Contact',
        },
      ],
      quickLinks: [
        {
          label: 'Besoin d\'aide',
          to: '/faq',
          icon: 'ri-question-line',
          iconAttrs: RI_ICON_ATTRS,
        },
        {
          label: 'Contactez-nous',
          to: '/contact',
          icon: 'ri-mail-line',
          iconAttrs: RI_ICON_ATTRS,
        },
      ],
      images: {
        logoHistoVec,
      },
    }
  },
})
</script>

<template>
  <DsfrHeader
    service-description="Historique du véhicule"
    service-title="HISTOVEC"
    :quick-links="quickLinks"
    :logo-text="['Ministère', 'de l’intérieur']"
  >
    <template #operator>
      <img
        class="fr-responsive-img"
        :src="images.logoHistoVec"
        alt="Logo HistoVec"
        style="width: 8rem;"
      >
    </template>
  </DsfrHeader>
  <div class="fr-container">
    <DsfrNavigation
      :nav-items="navItems"
      label="Menu principal"
    />
  </div>
</template>
