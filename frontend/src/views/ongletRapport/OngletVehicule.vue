<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'OngletVehicule',

  props: {
    caracteristiquesTechniques: {
      type: Object,
    },
  },
})
</script>


<template>
  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12  fr-pb-2w">
      <h6 class="fr-mb-0">
        Caractéristiques techniques
      </h6>
    </div>

    <div class="fr-col-6  fr-pt-0  fr-pb-1w">
      Marque
    </div>
    <div class="fr-col-2  fr-pt-0  fr-pb-1w">
      D.1
    </div>
    <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.marque }}
    </div>

    <div class="fr-col-6  fr-pt-0  fr-pb-1w">
      Type variante version
    </div>
    <div class="fr-col-2  fr-pt-0  fr-pb-1w">
      D.2
    </div>
    <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.tvv }}
    </div>

    <div class="fr-col-6  fr-pt-0  fr-pb-1w">
      Numéro CNIT
    </div>
    <div class="fr-col-2  fr-pt-0  fr-pb-1w">
      D.2.1
    </div>
    <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.cnit }}
    </div>

    <div class="fr-col-6  fr-pt-0  fr-pb-1w">
      Nom commercial
    </div>
    <div class="fr-col-2  fr-pt-0  fr-pb-1w">
      D.3
    </div>
    <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.modele }}
    </div>

    <div class="fr-col-6  fr-pt-0  fr-pb-1w">
      Couleur
    </div>
    <div class="fr-col-2  fr-pt-0  fr-pb-1w">
    </div>
    <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.couleur }}
    </div>

    <div class="fr-col-6  fr-pt-0  fr-pb-1w">
      Type de réception
    </div>
    <div class="fr-col-2  fr-pt-0  fr-pb-1w">
    </div>
    <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.reception.type }}
    </div>

    <div class="fr-col-6  fr-pt-0  fr-pb-1w">
      Numéro d'identification véhicule
    </div>
    <div class="fr-col-2  fr-pt-0  fr-pb-1w">
      E
    </div>
    <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.vin }}
    </div>

    <template v-if="caracteristiquesTechniques.PT.admissible">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        PT techniquement admissible (kg)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        F.1
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.PT.admissible }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.PT.AC">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        PTAC (kg)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        F.2
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.PT.AC }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.PT.RA">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        PTRA (kg)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        F.3
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.PT.RA }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.PT.service">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        PT en service (kg)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        G
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.PT.service }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.PT.AV">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        PTAV (kg)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        G.1
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.PT.AV }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.categorie">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Catégorie (CE)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        J
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.categorie }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.genre">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Genre (National)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        J.1
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.genre }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.carrosserie.ce">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Carrosserie (CE)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        J.2
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.carrosserie.ce }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.carrosserie.national">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Carrosserie (National)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        J.3
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.carrosserie.national }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.reception.numero">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Numéro de réception
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        K
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.reception.numero }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.puissance.cylindres">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Cylindrée (cm3)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        P.1
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.puissance.cylindres }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.puissance.nette">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Puissance nette max (kW)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        P.2
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.puissance.nette }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.energie">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Energie
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        P.3
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.energie }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.puissance.cv">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Puissance CV
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        P.6
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.puissance.cv }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.puissance.norm">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Puissance / masse (kW/kg)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        Q
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.puissance.norm }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.places.assis">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Places assises
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        S.1
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.places.assis }}
      </div>
    </template>

    <div class="fr-col-6  fr-pt-0  fr-pb-1w">
      Places debout
    </div>
    <div class="fr-col-2  fr-pt-0  fr-pb-1w">
      S.2
    </div>
    <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      <template v-if="caracteristiquesTechniques.places.debout">
        {{ caracteristiquesTechniques.places.debout }}
      </template>
    </div>

    <template v-if="caracteristiquesTechniques.db">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Niveau sonore (db(A))
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        U.1
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.db }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.moteur">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Vitesse moteur (min-1)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        U.2
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.moteur }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.co2">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        CO2 (g/km)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        V.7
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.co2 }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.environnement">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Classe environnement (CE)
      </div>
      <div class="fr-col-2  fr-pt-0  fr-pb-1w">
        V.9
      </div>
      <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.environnement }}
      </div>
    </template>
  </div>
</template>
