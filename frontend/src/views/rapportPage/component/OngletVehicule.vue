<script>
import {defineComponent} from 'vue'
import { useRapportStore } from '@Stores/rapport'

export default defineComponent({
  name: 'OngletVehicule',

  data () {
    return {
      store: useRapportStore(),
      caracteristiqueTechnique: {},
    }
  },
  computed: {
    caracteristiquesTechniques () {
      const rapport = this.store.getRapport
      if (rapport) {
        return rapport.vehicule.caracteristiques
      }
      return this.caracteristiqueTechnique
    },
  },

})
</script>


<template>
  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12  fr-pb-2w">
      <h3 class="fr-mb-0 fr-h5">
        Caractéristiques techniques
      </h3>
    </div>

    <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6 fr-pt-0  fr-pb-1w">
      Marque
    </div>
    <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2 fr-pt-0  fr-pb-1w">
      D.1
    </div>
    <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4 fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.marque }}
    </div>

    <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
      Type variante version
    </div>
    <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
      D.2
    </div>
    <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.tvv }}
    </div>

    <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
      Numéro CNIT
    </div>
    <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
      D.2.1
    </div>
    <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.numCnit }}
    </div>

    <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
      Nom commercial
    </div>
    <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
      D.3
    </div>
    <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.nomCommercial }}
    </div>

    <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
      Couleur
    </div>
    <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
    </div>
    <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.couleur }}
    </div>

    <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
      Type de réception
    </div>
    <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
    </div>
    <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.typeReception }}
    </div>

    <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
      Numéro d'identification véhicule
    </div>
    <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
      E
    </div>
    <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ caracteristiquesTechniques.vin }}
    </div>

    <template v-if="caracteristiquesTechniques.champF1">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        PT techniquement admissible (kg)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        F.1
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.champF1 }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.champF2">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        PTAC (kg)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        F.2
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.champF2 }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.champF3">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        PTRA (kg)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        F.3
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.champF3 }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.champG">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        PT en service (kg)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        G
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.champG }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.champG1">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        PTAV (kg)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        G.1
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.champG1 }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.categorie">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Catégorie (CE)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        J
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.categorie }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.genre">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Genre (National)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        J.1
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.genre }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.carrosserieCe">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Carrosserie (CE)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        J.2
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.carrosserieCe }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.carrosserieNationale">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Carrosserie (National)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        J.3
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.carrosserieNationale }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.numeroReception">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Numéro de réception
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        K
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.numeroReception }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.cylindree">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Cylindrée (cm3)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        P.1
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.cylindree }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.puissanceNette">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Puissance nette max (kW)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        P.2
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.puissanceNette }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.energie">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Energie
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        P.3
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.energie }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.puissanceCv">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Puissance CV
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        P.6
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.puissanceCv }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.rapportPuissMasse">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Puissance / masse (kW/kg)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        Q
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.rapportPuissMasse }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.nbPlacesAssises">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Places assises
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        S.1
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.nbPlacesAssises }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.nbPlacesDebout">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Places debout
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        S.2
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.nbPlacesDebout }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.niveauSonore">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Niveau sonore (db(A))
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        U.1
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.niveauSonore }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.vitesseMoteur">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Vitesse moteur (min-1)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        U.2
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.vitesseMoteur }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.co2">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        CO2 (g/km)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        V.7
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.co2 }}
      </div>
    </template>

    <template v-if="caracteristiquesTechniques.pollution">
      <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
        Classe environnement (CE)
      </div>
      <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
        V.9
      </div>
      <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ caracteristiquesTechniques.pollution }}
      </div>
    </template>
  </div>
</template>
