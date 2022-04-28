<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <h6 class="title">
          Caractéristiques techniques
        </h6>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6">
        <span class="txt-small-12">Marque</span>
      </div>
      <div class="col-sm-2">
        <span class="bold txt-small-12">D.1</span>
      </div>
      <div class="col-sm-4">
        <span class="info_red txt-small-12">{{ caracteristiquesTechniques.marque }}</span>
      </div>
    </div>
    <div class="separator"></div>
    <div class="row">
      <div class="col-sm-6">
        <span class="txt-small-12">Type variante version</span>
      </div>
      <div class="col-sm-2">
        <span class="bold txt-small-12">D.2</span>
      </div>
      <div class="col-sm-4">
        <span class="info_red txt-small-12">{{ caracteristiquesTechniques.tvv }}</span>
      </div>
    </div>
    <div class="separator"></div>
    <div class="row">
      <div class="col-sm-6">
        <span class="txt-small-12">Numéro CNIT</span>
      </div>
      <div class="col-sm-2">
        <span class="bold txt-small-12">D.2.1</span>
      </div>
      <div class="col-sm-4">
        <span class="info_red txt-small-12">{{ caracteristiquesTechniques.cnit }}</span>
      </div>
    </div>
    <div class="separator"></div>
    <div class="row">
      <div class="col-sm-6">
        <span class="txt-small-12">Nom commercial</span>
      </div>
      <div class="col-sm-2">
        <span class="bold txt-small-12">D.3</span>
      </div>
      <div class="col-sm-4">
        <span class="info_red txt-small-12">{{ caracteristiquesTechniques.modele }}</span>
      </div>
    </div>
    <div class="separator"></div>
    <div class="row">
      <div class="col-sm-6">
        <span class="txt-small-12">Couleur</span>
      </div>
      <div class="col-sm-2">
        <span class="bold txt-small-12">&nbsp;</span>
      </div>
      <div class="col-sm-4">
        <span class="info_red txt-small-12">{{ caracteristiquesTechniques.couleur }}</span>
      </div>
    </div>
    <div class="separator"></div>
    <div class="row">
      <div class="col-sm-6">
        <span class="txt-small-12">Type de réception</span>
      </div>
      <div class="col-sm-2">
        <span class="bold txt-small-12">&nbsp;</span>
      </div>
      <div class="col-sm-4">
        <span class="info_red txt-small-12">{{ caracteristiquesTechniques.reception.type }}</span>
      </div>
    </div>
    <div class="separator"></div>
    <div class="row">
      <td
        class="no-trait-left no-trait-right"
        colspan="3"
      >
        &nbsp;
      </td>
    </div>
    <div class="separator"></div>
    <div class="row">
      <div class="col-sm-6">
        <span class="txt-small-12">Numéro d'identification véhicule</span>
      </div>
      <div class="col-sm-2">
        <span class="bold txt-small-12">E</span>
      </div>
      <div class="col-sm-4">
        <span class="info_red txt-small-12">{{ caracteristiquesTechniques.vin }}</span>
      </div>
    </div>
    <div class="separator"></div>
    <div class="row">
      <td colspan="3">
        &nbsp;
      </td>
    </div>
    <div class="separator"></div>
    <div v-if="caracteristiquesTechniques.PT.admissible">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">PT technique admissible (kg)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">F.1</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.PT.admissible }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.PT.AC">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">PTAC (kg)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">F.2</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.PT.AC }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.PT.RA">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">PTRA (kg)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">F.3</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.PT.RA }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.PT.admissible || caracteristiquesTechniques.PT.AC || caracteristiquesTechniques.PT.RA">
      <div class="row">
        <td colspan="3">
          &nbsp;
        </td>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.PT.service">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">PT en service (kg)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">G</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.PT.service }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.PT.AV">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">PTAV (kg)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">G.1</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.PT.AV }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.PT.service || caracteristiquesTechniques.PT.AV">
      <div class="row">
        <td colspan="3">
          &nbsp;
        </td>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.categorie">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Catégorie (CE)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">J</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.categorie }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.genre">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Genre (National)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">J.1</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.genre }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.carrosserie.ce">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Carrosserie (CE)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">J.2</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.carrosserie.ce }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.carrosserie.national">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Carrosserie (National)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">J.3</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.carrosserie.national }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div class="row">
      <td colspan="3">
        &nbsp;
      </td>
    </div>
    <div class="separator"></div>
    <div v-if="caracteristiquesTechniques.reception.numero">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Numéro de réception</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">K</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.reception.numero }}</span>
        </div>
      </div>
      <div class="separator"></div>
      <div class="row">
        <td colspan="3">
          &nbsp;
        </td>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.puissance.cylindres">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Cylindrée (cm3)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">P.1</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.puissance.cylindres }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.puissance.nette">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Puissance nette max (kW)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">P.2</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.puissance.nette }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.energie">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Energie</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">P.3</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.energie }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.puissance.cv">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Puissance CV</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">P.6</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.puissance.cv }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div class="row">
      <td colspan="3">
        &nbsp;
      </td>
    </div>
    <div class="separator"></div>
    <div v-if="caracteristiquesTechniques.puissance.norm">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Puissance / masse (kW/kg)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">Q</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.puissance.norm }}</span>
        </div>
      </div>
      <div class="separator"></div>
      <div class="row">
        <td colspan="3">
          &nbsp;
        </td>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.places.assis">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Places assises</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">S.1</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.places.assis }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div>
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Places debout</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">S.2</span>
        </div>
        <div class="col-sm-4">
          <span
            v-if="caracteristiquesTechniques.places.debout"
            class="info_red txt-small-12"
          >
            {{ caracteristiquesTechniques.places.debout }}
          </span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div class="row">
      <td colspan="3">
        &nbsp;
      </td>
    </div>
    <div class="separator"></div>
    <div v-if="caracteristiquesTechniques.db">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Niveau sonore (db(A))</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">U.1</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.db }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.moteur">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Vitesse moteur (min-1)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">U.2</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.moteur }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.db || caracteristiquesTechniques.moteur">
      <div class="row">
        <td colspan="3">
          &nbsp;
        </td>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.co2">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">CO2 (g/km)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">V.7</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.co2 }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div v-if="caracteristiquesTechniques.environnement">
      <div class="row">
        <div class="col-sm-6">
          <span class="txt-small-12">Classe environnement (CE)</span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12">V.9</span>
        </div>
        <div class="col-sm-4">
          <span class="info_red txt-small-12">{{ caracteristiquesTechniques.environnement }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    caracteristiquesTechniques: {
      type: Object,
      default: () => {},
    },
  },
  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/vehicle`)
  },
}

</script>
