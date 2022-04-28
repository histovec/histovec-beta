<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import contactParameters from '@/assets/json/contact.json'


export default defineComponent({
  name: 'ContactPage',

  components: { RouterLink },

  data () {
    return {
      selectedChoice: undefined,
      object: undefined,
      email: undefined,
      message: undefined,

      options: [
        contactParameters.subject.transfer,
        contactParameters.subject.registrationCardChange,
        contactParameters.subject.registrationCardLoss,
        contactParameters.subject.resolvePV,
        contactParameters.subject.personalData,
        contactParameters.subject.reportData,
      ],
    }
  },

  computed: {
    isFormDisabled () {
      return this.selectedChoice !== contactParameters.subject.contact
    },
  },
})
</script>

<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-offset-1 fr-col-11">
      <DsfrBreadcrumb
        :links="[
          {
            to: '/accueil',
            text: 'Accueil',
          },
          {
            text: 'Contact',
          },
        ]"
      />
    </div>

    <div class="fr-col-12">
      <h1>Nous contacter</h1>
      <p class="fr-text--xl">
        Vous n'avez pas trouvé la réponse à votre question dans la page
        <router-link
          class="fr-link"
          to="/faq"
        >
          FAQ et Liens utiles
        </router-link> ?
      </p>
      <p class="fr-text--xl">
        Remplissez le formulaire ci-dessous et expliquez-nous votre problème.
      </p>
    </div>
  </div>

  <div
    class="fr-grid-row fr-grid-row--gutters"
    style="margin-bottom: 2rem"
  >
    <div class="fr-col-12">
      <DsfrSelect
        v-model="selectedChoice"
        required
        label="Thème"
        :options="['ANTS', 'SIV']"
        description="Sélectionnez un thème parmi les options suivantes ou renseignez le vôtre en choisissant 'Autre'."
      />
    </div>
    <div class="fr-col-12">
      <DsfrSelect
        v-model="selectedChoice"
        required
        label="Sujet"
        :options="options"
        description="Sélectionnez un sujet parmi les options suivantes ou renseignez le vôtre en choisissant 'Autre'."
      />
    </div>
    <div class="fr-col-12">
      <DsfrInput
        v-model="object"
        required
        label="Objet"
        :disabled="isFormDisabled"
      />
    </div>
    <div class="fr-col-12">
      <DsfrInput
        v-model="email"
        required
        label="Adresse mail"
        description="Renseignez votre adresse mail"
        :disabled="isFormDisabled"
      />
    </div>
    <div class="fr-col-12">
      <DsfrInput
        v-model="message"
        required
        label="Votre message"
        :disabled="isFormDisabled"
        is-textarea
      />
    </div>
  </div>

  <div
    class="fr-grid-row fr-grid-row--gutters"
    style="margin-bottom: 4rem"
  >
    <div
      class="fr-col-12"
      style="text-align: center"
    >
      <DsfrButton
        label="Envoyer"
        on-click="@todo"
      />
    </div>
  </div>
</template>
