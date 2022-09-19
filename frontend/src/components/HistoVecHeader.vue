<script>
import { defineComponent } from 'vue'

import logoHistoVec from '@/assets/img/logo_histovec_simple.svg?url'

export default defineComponent({
  name: 'HistoVecHeader',

  data () {
    return {
      navItems: [
        {
          to: 'accueil',
          text: 'Accueil',
        },
        {
          to: 'proprietaire',
          text: 'Propriétaire',
        },
        {
          to: 'acheteur',
          text: 'Acheteur',
        },
        {
          to: 'faq',
          text: 'FAQ & Liens utiles',
        },
        {
          to: 'contact',
          text: 'Contact',
        },
      ],
      quickLinks: [
        {
          label: 'Besoin d\'aide',
          to: 'faq',
          icon: 'fr-fi-question-line',
        },
        {
          label: 'Contactez-nous',
          to: 'contact',
          icon: 'fr-fi-mail-line',
        },
      ],
      images: {
        logoHistoVec,
      },
      menuOpened: false,
    }
  },
  methods: {
    ouvrirMenu() {
      this.menuOpened = true;
    },
    fermerMenu() {
      this.menuOpened = false;
    },
  },
})
</script>

<template>
  <header
    role="banner"
    class="fr-header"
  >
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <p class="fr-logo">
                  Ministère
                  <br>de l'intérieur
                </p>
              </div>
              <div class="fr-header__operator">
                <img
                  class="fr-responsive-img fr-image-header"
                  :src="images.logoHistoVec"
                  alt="Logo HistoVec"
                />
              </div>
              <div class="fr-header__navbar">
                <button
                  id="button-menu-header"
                  class="fr-btn--menu fr-btn"
                  data-fr-opened="false"
                  title="Menu"
                  @click="ouvrirMenu"
                >
                  Menu
                </button>
              </div>
            </div>
            <div class="fr-header__service">
              <router-link
                to="/"
                target="_self"
                title="Accueil - HISTOVEC - historique du véhicule"
              >
                <p class="fr-header__service-title">HISTOVEC</p>
              </router-link>
              <p class="fr-header__service-tagline">
                Historique du véhicule
              </p>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-btns-group">
                <li
                  v-for="(quickLink, index) in quickLinks"
                  :key="index"
                >
                  <router-link
                    :class="'fr-btn ' + quickLink.icon"
                    :to="quickLink.to"
                    target="_self"
                    :title="quickLink.label"
                  >
                    {{ quickLink.label }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      id="modal-menu-header"
      class="fr-header__menu fr-modal"
      :class="{ 'fr-modal--opened': menuOpened }"
    >
      <div class="fr-container">
        <button
          class="fr-btn--close fr-btn"
          title="Fermer"
          @click="fermerMenu"
        >
          Fermer
        </button>
        <div class="fr-header__menu-links">
          <ul class="fr-btns-group">
            <li
              v-for="(quickLink, index) in quickLinks"
              :key="index"
            >
              <router-link
                :class="'fr-btn ' + quickLink.icon"
                :to="quickLink.to"
                target="_self"
                :title="quickLink.label"
                @click="fermerMenu"
              >
                {{ quickLink.label }}
              </router-link>
            </li>
          </ul>
        </div>
        <nav
          id="navigation-517"
          class="fr-nav"
          role="navigation"
          aria-label="Menu principal"
        >
          <ul class="fr-nav__list">
            <li
              v-for="(navItem, index) in navItems"
              :key="index"
              class="fr-nav__item"
            >
              <router-link
                class="fr-nav__link"
                :to="navItem.to"
                target="_self"
                :title="navItem.text"
                @click="fermerMenu"
              >
                {{ navItem.text }}
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>

.fr-image-header {
  max-width:9.0625rem;
}
</style>
