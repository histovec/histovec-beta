<script>
import { defineComponent } from 'vue'

import HistoVecButtonLink from '@Components/HistoVecButtonLink.vue'
import ImagePresentation from '@Components/ImagePresentation.vue';
import TuileDsfrNonCliquable from '@Components/TuileDsfrNonCliquable.vue'

import {
  FAQ_THEMES,
  FAQ_THEMES_OPTIONS,
} from '@Constants/faq.js'

import faqSvg from '@Assets/img/faq.svg?url'

import { mailTo } from '@Utils/email.js'
import { CAS_TOULOUSE_EMAIL, ABOUT_UNPAID_PV_EMAIL } from '@Constants/email.js'
import api from '@Api/index.js'

import '@/assets/stylesheets/globale.css'

export default defineComponent({
  name: 'FAQPage',

  components: { HistoVecButtonLink, ImagePresentation, TuileDsfrNonCliquable },

  data () {
    return {
      expandedId: undefined,

      image:{
        faqSvg,
      },
      selectedTheme: undefined,

      // email
      CAS_TOULOUSE_EMAIL,

      // constants
      FAQ_THEMES,
      FAQ_THEMES_OPTIONS,
    }
  },

  created () {
    api.log('/faq')
    this.aboutUnpaidPvEmail = mailTo(ABOUT_UNPAID_PV_EMAIL)
  },
})
</script>

<template>
  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12">
      <DsfrBreadcrumb
        class="fr-mb-0"
        :links="[
          {
            to: '/accueil',
            text: 'Accueil',
          },
          {
            text: 'FAQ et Liens utiles',
          },
        ]"
      />
    </div>
    <div class="fr-col-lg-4 fr-col-xl-4">
      <ImagePresentation :src="image.faqSvg" />
    </div>
    <div class="fr-col-12  fr-col-lg-8  fr-col-xl-8  fr-mt-10v">
      <h1>Besoin d'aide ?</h1>
      <h2>Consultez la FAQ et les liens utiles</h2>
      <p class="fr-text--xl">
        Si vous ne trouvez pas de réponse à votre question, n'hésitez pas à nous contacter.
      </p>
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12">
      <h2>Liens utiles</h2>
    </div>

    <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
      <div class="fr-col-12  fr-col-md-6  fr-col-lg-5  fr-col-xl-5">
        <TuileDsfrNonCliquable
          titre="Pour les vendeurs"
        >
          <ul>
            <li> Prendre connaissance des démarches
              <a
                class="fr-link"
                href="https://service-public.fr"
                title="Service Public - www.service-public.fr - Nouvelle fenêtre"
              > (Service Public)
              </a>
            </li>
            <li> Télécharger le certificat de situation administrative
              <router-link
                class="fr-link"
                to="/proprietaire"
                title="Proprietaire - HISTOVEC - Nouvelle fenêtre"
              > (HistoVec)
              </router-link>
            </li>
            <li> Déclarer la cession d'un véhicule
              <a
                class="fr-link"
                href="https://immatriculation.ants.gouv.fr"
                title="ANTS - www.immatriculation.ants.gouv.fr - Nouvelle fenêtre"
              >
                (A&#8203;N&#8203;T&#8203;S)
              </a>
            </li>
          </ul>
        </TuileDsfrNonCliquable>
      </div>
      <div class="fr-col-12  fr-col-md-6  fr-col-lg-5  fr-col-xl-5">
        <TuileDsfrNonCliquable
          titre="Pour les acheteurs"
        >
          <ul>
            <li> Prendre connaissance des démarches
              <a
                class="fr-link"
                href="https://service-public.fr"
                title="Service Public - www.service-public.fr - Nouvelle fenêtre"
              > (Service Public)
              </a>
            </li>
            <li> Faire une demande de changement de titulaire du certificat d'immatriculation
              <a
                class="fr-link"
                href="https://immatriculation.ants.gouv.fr"
                title="ANTS - www.immatriculation.ants.gouv.fr - Nouvelle fenêtre"
              >
                (A&#8203;N&#8203;T&#8203;S)
              </a>
            </li>
          </ul>
        </TuileDsfrNonCliquable>
      </div>
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div class="fr-col-12  fr-pb-0">
      <h2>
        Foire aux Questions
      </h2>
    </div>

    <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10  fr-pt-0">
      <DsfrSelect
        v-model="selectedTheme"
        required
        label="Thème"
        :options="FAQ_THEMES_OPTIONS"
        description="Sélectionnez un thème parmi les suivants."
      />
    </div>
    <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10" aria-live="polite">
      <div
        v-if="selectedTheme === FAQ_THEMES.WHY_HISTOVEC" >
        <DsfrAccordionsGroup>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Je vends mon véhicule d’occasion"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                HistoVec vous permet de valoriser votre offre en fournissant gratuitement un rapport d’historique
                officiel qui rassurera vos acheteurs potentiels.
                Le certificat de situation administrative détaillée y est également téléchargeable.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="J’achète un véhicule d’occasion"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                HistoVec vous permet de vous informer, de faire un choix éclairé sur les véhicules sélectionnés et
                d’éviter les mauvaises surprises.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Je suis un professionnel négociant automobile"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Fiabilisez et valorisez votre stock de véhicules d’occasion en permettant à votre entreprise et vos
                clients de vérifier l’historique des véhicules acquis.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Je loue ma voiture à des particuliers"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Je peux rassurer mes clients potentiels en fournissant gratuitement un historique officiel du véhicule.
              </p>
            </DsfrAccordion>
          </li>
        </DsfrAccordionsGroup>
      </div>

      <div
        v-if="selectedTheme === FAQ_THEMES.HOW_HISTOVEC">
        <DsfrAccordionsGroup>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Qui peut consulter HistoVec ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <h3>Vous êtes vendeur :</h3>
              <ul class="fr-ml-4w  fr-pl-0">
                <li>
                  Sur la page Propriétaire, remplissez le formulaire avec les informations figurant sur le certificat
                  d'immatriculation en cours de validité.
                  Si le véhicule appartient à une entreprise, une collectivité, ou une association, cliquez sur «
                  Personne morale » et renseignez, le cas échéant, le numéro de S&#8203;I&#8203;R&#8203;E&#8203;N.
                </li>
                <li>
                  Le rapport du véhicule est affiché. Vous pouvez consulter les différentes sections sur le menu de
                  gauche.
                </li>
                <li>
                  Vous pouvez transmettre le lien vers le rapport à un tiers en cliquant sur le menu “Transmettre le
                  rapport”.
                </li>
              </ul>

              <h3>Vous êtes acheteur :</h3>
              <ul class="fr-ml-4w  fr-pl-0">
                <li>
                  Demandez au vendeur de vous transmettre le lien vers le rapport en le générant sur le site HistoVec.
                </li>
              </ul>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Comment consulter le rapport d’un véhicule qui ne m’appartient pas ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Seul le titulaire du certificat d'immatriculation en cours de validité peut générer le rapport HistoVec
                de son véhicule, qu'il choisit de transmettre à des tiers.
              </p>
              <p>
                Si vous n’êtes pas le titulaire du certificat d'immatriculation en cours de validité, vous ne pouvez pas
                consulter directement les données HistoVec pour ce véhicule. Il vous est possible de demander au
                propriétaire actuel la transmission par mél du rapport HistoVec en sélectionnant le profil acheteur sur
                la page d'accueil du site HistoVec.
              </p>
              <p>
                Les locataires longue durée (LDD) doivent être mandatés par le propriétaire du véhicule.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <!-- @todo @doublonFaq3 Voir avec la DSR lequel on souhaite garder -->
            <DsfrAccordion
              class="background-accordeon-white"
              title="Que faire si le lien du rapport HistoVec que l’on m’a envoyé ne fonctionne pas ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Le titulaire du véhicule vous a transmis un lien, celui-ci ne fonctionne pas. Les cas suivants peuvent
                être rencontrés :
              </p>
              <ol class="fr-ml-4w  fr-pl-0">
                <li>
                  Le lien a été probablement mal copié ou transmis - HistoVec vous signale alors une erreur:
                  <ul class="fr-ml-4w  fr-pl-0">
                    <li>
                      Le lien transmis est incomplet
                    </li>
                    <li>
                      Le rapport a été trouvé, mais la clé pour l'ouvrir est invalide
                    </li>
                  </ul>
                  Pensez à l'alternative de l'envoi par QR-Code si les mails n'ont pas permis d'aboutir.
                </li>
                <li>
                  Le rapport n'existe pas, ou n'est plus disponible pour des raisons de sécurité - HistoVec vous signale
                  alors une erreur.
                </li>
                <li>
                  Le rapport ne semble pas ou plus disponible.
                  <br/>
                  Dans tous ces cas, il convient de demander à nouveau le rapport à votre vendeur.
                  <br/>
                  Si le problème persiste avec votre vendeur : contactez-nous.
                </li>
              </ol>
            </DsfrAccordion>
          </li>
          <li>
            <!-- @todo @doublonFaq4 Voir avec la DSR lequel on souhaite garder -->
            <DsfrAccordion
              class="background-accordeon-white"
              title="Quelle différence y a-t-il entre la notion de propriétaire et titulaire ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>Propriétaire du véhicule et titulaire du certificat d'immatriculation sont deux notions différentes
                :</p>
              <ul class="fr-ml-4w  fr-pl-0">
                <li>Propriétaire: il s'agit du propriétaire du véhicule et qui peut donc le vendre.</li>
                <li>Titulaire: il s'agit de la ou les personne(s) titulaire du droit à circuler avec le véhicule.</li>
              </ul>
              <p>
                Le propriétaire du véhicule et titulaire du certificat d'immatriculation sont le plus souvent la même
                personne, mais peuvent être différents. C'est pourquoi, HistoVec distingue les opérations qui
                correspondent à la vente du véhicule ("cession/vente par un particulier" et "achat/reprise par un
                professionnel ") du changement de titulaire.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Que faire si le message « accès non autorisé » s’affiche lors de ma recherche ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Il convient de renouveler votre recherche sur un autre navigateur ainsi qu'un autre appareil, de
                préférence un ordinateur.
                <br/>
                Pour un usage optimal, nous conseillons l'utilisation de la dernière version de Firefox.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Quelles sont les informations à indiquer pour effectuer ma recherche ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Il convient d’indiquer le nom de naissance du titulaire du certificat d’immatriculation en cours de
                validité et son ou ses prénoms. Assurez-vous de reprendre bien l’orthographe telle qu’elle figure sur le
                certificat d'immatriculation et vérifiez le nombre de prénoms.
              </p>
              <p>
                Pour les véhicules avec un ancien numéro d'immatriculation, reprenez les nom et prénom exactement comme
                ils sont indiqués sur le certificat d'immatriculation, sans préciser "M et Mme" par exemple.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <!-- @todo @doublonFaq1 Voir avec la DSR lequel on souhaite garder -->
            <DsfrAccordion
              class="background-accordeon-white"
              title="Comment effectuer la recherche sur HistoVec pour un véhicule en location longue durée (LLD) ou en location avec option d’achat (LOA ou leasing) ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Pour les locataires de véhicules en LDD ou LOA, dûment mandatés par le propriétaire du véhicule, il
                convient de renseigner les informations du propriétaire.
              </p>
              <p>
                Par exemple, pour une société de location, cliquez sur l'onglet Personne morale et remplissez le
                formulaire de recherche en indiquant, le cas échéant, le n° S&#8203;I&#8203;R&#8203;E&#8203;N de la société qui vous loue le
                véhicule.
              </p>
              <p>
                Il convient de procéder de même si le véhicule est en leasing, à partir des informations correspondant à
                l’établissement financier auprès duquel vous avez souscrit le contrat de location.
              </p>
              <p>
                Nous vous rappelons que vous ne pouvez vendre un véhicule en tant que locataire. Si vous souhaitez
                acquérir le véhicule, il convient de contacter l'organisme propriétaire afin qu'il puisse vous assister
                dans vos démarches. Pour plus d'informations, nous vous invitons à consulter le site Service Public en
                suivant
                <a
                  class="fr-link"
                  href="https://www.service-public.fr/particuliers/vosdroits/F2437"
                  rel="noopener noreferrer"
                  target="_blank"
                >ce lien</a>.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Comment consulter HistoVec si je n’ai pas le certificat d'immatriculation en cours de validité ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                La consultation d'HistoVec n'est possible que par le titulaire de ce certificat d'immatriculation, c'est
                pourquoi il est notamment nécessaire d'indiquer le n° de formule figurant sur ce document.
              </p>
              <p>
                Si vous ne disposez plus du certificat d'immatriculation en cours de validité, nous vous invitons à
                contacter l'Agence nationale des titres sécurisés qui délivre ce document et les duplicatas :
              </p>
              <ul class="fr-ml-4w  fr-pl-0">
                <li>
                  <a
                    class="fr-link"
                    href="https://ants.gouv.fr/monespace/s-inscrire"
                    rel="noopener noreferrer"
                    target="_blank"
                  >https://ants.gouv.fr/monespace/s-inscrire</a>
                </li>
                <li>
                  ou par téléphone au 3400.
                </li>
              </ul>
            </DsfrAccordion>
          </li>
        </DsfrAccordionsGroup>
      </div>

      <div
        v-if="selectedTheme === FAQ_THEMES.VEHICLE_NOT_FOUND" >
        <DsfrAccordionsGroup>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Que faire si je ne parviens pas à lancer la recherche de mon véhicule ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Nous vous invitons à essayer sur un autre navigateur ainsi qu'un autre appareil. Pour un usage optimal,
                nous conseillons l'utilisation de Firefox (version supérieure à v60) ou de Chrome.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Que faire si la recherche de mon véhicule n’aboutit pas ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Vérifiez les informations que vous avez saisies :
              </p>
              <ul class="fr-ml-4w  fr-pl-0">
                <li>
                  Les nom et prénom du titulaire actuel du certificat d'immatriculation (nom de naissance, orthographe,
                  nombre de prénoms…) ;
                </li>
                <li>
                  Si le véhicule appartient à une entreprise, assurez-vous de renseigner le formulaire sous l’onglet «
                  Personne morale » et, s’il s’agit d’une entreprise, d’indiquer le n° S&#8203;I&#8203;R&#8203;E&#8203;N ou SIRET correspondant à
                  votre société ;
                </li>
                <li>
                  Le n° de formule doit être celui du certificat d'immatriculation en cours de validité :
                  <ul class="fr-ml-4w  fr-pl-0">
                    <li>
                      Si le certificat d'immatriculation a précédemment été déclaré perdu ou volé, un duplicata vous a
                      été adressé. Il convient d'indiquer sur HistoVec le n° de formule de ce dernier certificat
                      d'immatriculation.
                    </li>
                    <li>
                      Si le véhicule n’est plus immatriculé à votre nom, vous ne pouvez plus avoir accès à ces
                      informations sur HistoVec.
                    </li>
                  </ul>
                </li>
                <li>
                  Si votre véhicule est immatriculé sous un ancien n° d’immatriculation, assurez-vous d'indiquer la date
                  du certificat d'immatriculation, et non la date de 1ère immatriculation du véhicule.
                </li>
              </ul>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Je viens de recevoir mon certificat d’immatriculation mais je ne trouve pas mon véhicule sur HistoVec"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                La mise à jour des informations sur HistoVec prend quelques jours, c’est pourquoi votre véhicule peut ne
                pas figurer immédiatement sur HistoVec.
              </p>
              <p>
                Nous vous invitons à consulter de nouveau le site après quelques jours.
              </p>
              <p>
                Dans l’attente, si vous avez besoin de vendre votre véhicule, vous pouvez également vous procurer le
                certificat de situation administrative sur le
                <a
                  class="fr-link"
                  href="https://siv.interieur.gouv.fr/map-usg-ui/do/accueil_certificat"
                  rel="noopener noreferrer"
                  target="_blank"
                >site de l'A&#8203;N&#8203;T&#8203;S</a>.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <!-- @todo @doublonFaq1 Voir avec la DSR lequel on souhaite garder -->
            <DsfrAccordion
              class="background-accordeon-white"
              title="Comment effectuer la recherche sur HistoVec pour un véhicule en location longue durée (LLD) ou en location avec option d’achat (LOA ou leasing) ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Pour les locataires de véhicules en LDD ou LOA, dûment mandatés par le propriétaire du véhicule, il
                convient de renseigner les informations du propriétaire.
              </p>
              <p>
                Par exemple, pour une société de location, cliquez sur l'onglet Personne morale et remplissez le
                formulaire de recherche en indiquant, le cas échéant, le n° S&#8203;I&#8203;R&#8203;E&#8203;N de la société qui vous loue le
                véhicule.
              </p>
              <p>
                Il convient de procéder de même si le véhicule est en leasing, à partir des informations correspondant à
                l’établissement financier auprès duquel vous avez souscrit le contrat de location.
              </p>
              <p>
                Nous vous rappelons que vous ne pouvez vendre un véhicule en tant que locataire. Si vous souhaitez
                acquérir le véhicule, il convient de contacter l'organisme propriétaire afin qu'il puisse vous assister
                dans vos démarches. Pour plus d'informations, nous vous invitons à consulter le site Service Public en
                suivant
                <a
                  class="fr-link"
                  href="https://www.service-public.fr/particuliers/vosdroits/F2437"
                  rel="noopener noreferrer"
                  target="_blank"
                >ce lien</a>.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Tous les véhicules figurent-ils sur HistoVec ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Les véhicules avec une immatriculation provisoire ne sont pas consultables sur HistoVec.
              </p>
              <p>
                Si vous souhaitez disposer du certificat de situation administrative, nous vous invitons à le
                télécharger auprès de l’A&#8203;N&#8203;T&#8203;S (Agence Nationale des Titres Sécurisés) en suivant
                <a
                  class="fr-link"
                  href="https://siv.interieur.gouv.fr/map-usg-ui/do/accueil_certificat"
                  rel="noopener noreferrer"
                  target="_blank"
                >ce lien</a>.
              </p>
              <p>
                <!-- @todo @doublonFaq2 Voir avec la DSR lequel on souhaite garder -->
                Pour toute information, vous pouvez contacter l'A&#8203;N&#8203;T&#8203;S par téléphone au 3400.
              </p>
              <p>
                Pour des raisons de sécurité, les véhicules diplomatiques et les véhicules des administrations de l’Etat
                ne figurent pas non plus dans HistoVec.
              </p>
              <p>
                Pour les véhicules diplomatiques, vous pouvez prendre l'attache du service des immatriculations des
                véhicules diplomatiques à la Préfecture de Police de Paris pour obtenir des informations plus détaillées
                sur votre véhicule.
              </p>
              <p>
                Pour les véhicules des administrations civiles de l’Etat, nous vous invitons à télécharger le certificat
                de situation administrative détaillé auprès de l’A&#8203;N&#8203;T&#8203;S (Agence Nationale des Titres Sécurisés) en suivant
                <a
                  class="fr-link"
                  href="https://siv.interieur.gouv.fr/map-usg-ui/do/accueil_certificat"
                  rel="noopener noreferrer"
                  target="_blank"
                >ce lien</a>.
              </p>
              <p>
                <!-- @todo @doublonFaq2 Voir avec la DSR lequel on souhaite garder -->
                Pour toute information, vous pouvez contacter l'A&#8203;N&#8203;T&#8203;S par téléphone au 3400.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <!-- @todo @doublonFaq3 Voir avec la DSR lequel on souhaite garder -->
            <DsfrAccordion
              class="background-accordeon-white"
              title="Que faire si le lien du rapport HistoVec que l’on m’a envoyé ne fonctionne pas ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Le titulaire du véhicule vous a transmis un lien, celui-ci ne fonctionne pas. Les cas suivants peuvent
                être rencontrés :
              </p>
              <ol class="fr-ml-4w  fr-pl-0">
                <li>
                  Le lien a été probablement mal copié ou transmis - HistoVec vous signale alors une erreur:
                  <ul class="fr-ml-4w  fr-pl-0">
                    <li>
                      Le lien transmis est incomplet
                    </li>
                    <li>
                      Le rapport a été trouvé, mais la clé pour l'ouvrir est invalide
                    </li>
                  </ul>
                  Pensez à l'alternative de l'envoi par QR-Code si les mails n'ont pas permis d'aboutir.
                </li>
                <li>
                  Le rapport n'existe pas, ou n'est plus disponible pour des raisons de sécurité - HistoVec vous signale
                  alors une erreur.
                </li>
                <li>
                  Le rapport ne semble pas ou plus disponible.
                  <br/>
                  Dans tous ces cas, il convient de demander à nouveau le rapport à votre vendeur.
                  <br/>
                  Si le problème persiste avec votre vendeur : contactez-nous.
                </li>
              </ol>
            </DsfrAccordion>
          </li>
        </DsfrAccordionsGroup>
      </div>

      <div
        v-if="selectedTheme === FAQ_THEMES.AVAILABLE_INFORMATIONS" >
        <DsfrAccordionsGroup>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Que signifient les termes des opérations figurant dans l’historique ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <ul class="fr-ml-4w  fr-pl-0">
                <li>
                  Première immatriculation d'un véhicule neuf, opération d'immatriculation d'un véhicule qui n'a jamais
                  été immatriculé.
                </li>
                <li>
                  Première immatriculation à l'étranger, le véhicule a été immatriculé en tant que véhicule neuf à
                  l'étranger.
                </li>
                <li>
                  Première immatriculation d'un véhicule importé, véhicule déjà immatriculé à l'étranger qui se fait
                  immatriculer en France pour la première fois.
                </li>
                <li>
                  Première immatriculation (source incertaine), opération fournie à titre indicatif lorsque aucune
                  opération telle que « Première immatriculation d'un véhicule neuf » ou « Première immatriculation à
                  l'étranger » n'est associée à la date présente dans le fichier. Cela peut être dû à l'origine du
                  véhicule (p. ex. anciens véhicules militaires qui disposaient d'une immatriculation spéciale) ou à
                  l'absence de la donnée dans les anciens fichiers d'immatriculation (p. ex. certains véhicules
                  anciens).
                </li>
                <li>
                  Conversion au nouveau format d'immatriculation, changement d'immatriculation d'un véhicule passant du
                  format 1&#8203;2&#8203;3&#8203;4 ABC 5&#8203;6 au format AB-1&#8203;2&#8203;3-CD.
                </li>
                <li>
                  Cession (vente du véhicule), véhicule vendu par un particulier ou par un professionnel.
                </li>
                <li>
                  Changement de titulaire, opération correspondant au moment où un particulier effectue sa demande de
                  certificat d'immatriculation pour le mettre à son nom.
                </li>
                <li>
                  Achat ou reprise par un professionnel, opération correspondant au moment où un professionnel devient
                  acquéreur du véhicule.
                </li>
                <li>
                  Opposition au transfert du certificat d'immatriculation, état bloquant tout changement de titulaire.
                </li>
                <li>
                  Procédure de réparation contrôlée, procédure pendant laquelle les réparations sont contrôlées par un
                  expert en automobile.
                </li>
                <li>
                  Premier rapport d'expert, rapport de l'expert en automobile qui détermine la dangerosité du véhicule,
                  établit la liste des réparations et en évalue le montant.
                </li>
                <li>
                  Second rapport d'expert, rapport de l'expert en automobile qui indique notamment que le véhicule est
                  apte à circuler dans des conditions normales de sécurité.
                </li>
              </ul>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Quels sinistres figurent sur HistoVec ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Seules les informations connues du ministère de l’Intérieur sont fournies. Par exemple, ne sont
                enregistrés que les sinistres déclarés à l’assureur et pour lesquels un expert a enregistré une
                procédure VRC (Véhicule à Réparation Contrôlée).
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <!-- @todo @doublonFaq4 Voir avec la DSR lequel on souhaite garder -->
            <DsfrAccordion
              class="background-accordeon-white"
              title="Quelle différence y a-t-il entre la notion de propriétaire et titulaire ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>Propriétaire du véhicule et titulaire du certificat d'immatriculation sont deux notions différentes
                :</p>
              <ul class="fr-ml-4w  fr-pl-0">
                <li>Propriétaire: il s'agit du propriétaire du véhicule et qui peut donc le vendre.</li>
                <li>Titulaire: il s'agit de la ou les personne(s) titulaire du droit à circuler avec le véhicule.</li>
              </ul>
              <p>
                Le propriétaire du véhicule et titulaire du certificat d'immatriculation sont le plus souvent la même
                personne, mais peuvent être différents. C'est pourquoi, HistoVec distingue les opérations qui
                correspondent à la vente du véhicule ("cession/vente par un particulier" et "achat/reprise par un
                professionnel ") du changement de titulaire.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Comment puis-je récupérer le rapport d’un expert en automobile ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                HistoVec ne peut afficher les détails des rapports (p. ex. éléments à réparer), car ceux-ci ne sont pas
                transmis en tant que tels dans le système d'immatriculation des véhicules (SIV). Dès lors, si vous
                achetez le véhicule, n'hésitez pas à demander au vendeur s'il est en possession du rapport d'expertise.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Pourquoi HistoVec affiche-t-il une opposition au transfert du certificat d’immatriculation ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Si HistoVec affiche une opposition au transfert du certificat d’immatriculation, cela peut être dû à une
                amende impayée.
              </p>
              <p>
                Pour les questions relatives au paiement des amendes, nous vous invitons à contacter le Centre Amendes
                Service au 05 40 13 08 80 ou par mail à
                <a
                  class="fr-link"
                  :href="aboutUnpaidPvEmail"
                >
                  {{ CAS_TOULOUSE_EMAIL }}
                </a>
                , ou
                <a
                  class="fr-link"
                  href="http://www.antai.gouv.fr"
                  rel="noopener noreferrer"
                  target="_blank"
                >l'A&#8203;N&#8203;T&#8203;A&#8203;I</a> :
              </p>
              <ul class="fr-ml-4w  fr-pl-0">
                <li>
                  Tél : 0 806 60 96 25 (infractions concernant le Procès-verbal électronique)
                </li>
                <li>
                  Tél : 0811 10 10 10 (paiement)
                </li>
                <li>
                  Tél : 0 806 60 66 06
                </li>
              </ul>
              <p>
                Informations complémentaires : Un centre d'appel téléphonique est mis à disposition des usagers pour
                toutes les questions relatives aux avis de contravention. Horaires d'ouverture : Lundi au Vendredi :
                8h30-18h30 ; Samedi : 8h30-12h30. Pour les infractions concernant les radars automatiques, contactez le
                0806 60 66 06 (numéro non surtaxé) ; pour le procès-verbal électronique (PVe), le 0806 60 96 25 (numéro
                non surtaxé) ; pour les amendes forfaitaires délictuelles, le 0806 60 53 81 (numéro non surtaxé).
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Que faire si mon véhicule est gagé ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Si votre véhicule est gagé, nous vous invitons à vous rapprocher du créancier qui peut seul lever le
                gage.
              </p>
              <p>
                Si vous ne connaissez pas l’identité du créancier, il convient de télécharger le certificat de situation
                administrative sur le site de l'Agence nationale des titres sécurisés (https://ants.gouv.fr) en suivant
                <a
                  class="fr-link"
                  href="https://siv.interieur.gouv.fr/map-usg-ui/do/accueil_certificat"
                  rel="noopener noreferrer"
                  target="_blank"
                >ce lien</a>.
              </p>
              <p>
                Pour toute information, vous pouvez contacter l'A&#8203;N&#8203;T&#8203;S par téléphone au 3400.
              </p>
              <p>
                Si le créancier a demandé récemment la levée du gage, il convient d’attendre quelques jours la mise à
                jours des informations dans HistoVec.
              </p>
              <p>
                Dans l’attente, nous vous invitons à télécharger le certificat de situation administrative auprès de
                l’A&#8203;N&#8203;T&#8203;S en suivant ce lien précité.
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Que faire en cas de déclaration valant saisie ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Pour obtenir des précisions sur une déclaration valant saisie, nous vous invitions à contacter l'A&#8203;N&#8203;T&#8203;S :
              </p>
              <ul class="fr-ml-4w  fr-pl-0">
                <li>
                  <a
                    class="fr-link"
                    href="https://immatriculation.ants.gouv.fr/demarches-en-ligne"
                    rel="noopener noreferrer"
                    target="_blank"
                  >https://immatriculation.ants.gouv.fr/demarches-en-ligne</a>
                </li>
                <li>ou par téléphone au 3400.</li>
              </ul>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Que faire si je reçois des amendes concernant un véhicule dont je ne suis plus propriétaire ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Pour ne plus recevoir les amendes d'un véhicule dont vous n'êtes plus propriétaire, il convient de
                déclarer la cession du véhicule auprès de l'Agence nationale des titres sécurisés :
              </p>
              <ul class="fr-ml-4w  fr-pl-0">
                <li>
                  via leur téléservice en suivant la procédure indiquée sur
                  <a
                    class="fr-link"
                    href="https://immatriculation.ants.gouv.fr/demarches-en-ligne"
                    rel="noopener noreferrer"
                    target="_blank"
                  >cette page</a>
                </li>
                <li>ou par téléphone au 3400.</li>
              </ul>
            </DsfrAccordion>
          </li>
        </DsfrAccordionsGroup>
      </div>

      <div
        v-if="selectedTheme === FAQ_THEMES.ERROR_IN_DISPLAYED_INFORMATIONS" >
        <DsfrAccordionsGroup>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Comment corriger une information manquante ou inexacte sur les données de mon véhicule ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                Pour signaler une erreur sur votre certificat d’immatriculation ou sur le dossier administratif de votre
                véhicule, nous vous invitons à contacter
                <a
                  class="fr-link"
                  href="https://ants.gouv.fr"
                  rel="noopener noreferrer"
                  target="_blank"
                >l'Agence nationale des titres sécurisés (https://ants.gouv.fr)</a> :
              </p>
              <ul class="fr-ml-4w  fr-pl-0">
                <li>
                  via leur téléservice en suivant la procédure indiquée sur
                  <a
                    class="fr-link"
                    href="https://immatriculation.ants.gouv.fr/demarches-en-ligne"
                    rel="noopener noreferrer"
                    target="_blank"
                  >cette page</a>
                </li>
                <li>ou par téléphone au 3400.</li>
              </ul>
            </DsfrAccordion>
          </li>
        </DsfrAccordionsGroup>
      </div>

      <div
        v-if="selectedTheme === FAQ_THEMES.KILOMETERS_AND_TECHNICAL_CONTROLS" >
        <DsfrAccordionsGroup>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Que faire si le kilométrage ou le contrôle technique de mon véhicule ne figurent pas sur HistoVec ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                HistoVec met à votre disposition certaines données enregistrées lors des différents contrôles techniques
                réglementaires, mais ne peut les modifier.
              </p>
              <p>
                En cas d’absence de contrôle technique ou de relevé de kilométrage, nous vous invitons à consulter <a
                  class="fr-link"
                  title="Le site utac-otc.com"
                  href="https://www.utac-otc.com/infos-pratiques/acc%C3%A8s-par-besoin"
                  rel="noopener noreferrer"
                  target="_blank"
                >le site de l'UTAC</a> (Union technique de l'automobile, du motocycle et du cycle).
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Que faire si le kilométrage de mon véhicule présente une incohérence ?"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p>
                HistoVec met à votre disposition certaines données enregistrées lors des différents contrôles techniques réglementaires, mais ne peut les modifier.
              </p>
              <p>
                HistoVec affiche par conséquent les résultats de l’ensemble des contrôles techniques et des kilométrages relevés lors de ces contrôles.
              </p>
              <p>
                Si les données relatives aux contrôles techniques ou aux kilométrages de ce véhicule vous semblent incorrectes, nous vous invitons à vous adresser :
              </p>

              <ul class="fr-ml-4w  fr-pl-0">
                <li>
                  si vous ne possédiez pas alors le véhicule, à la personne qui en était propriétaire lors de la
                  réalisation de ces contrôles ;
                </li>
                <li>
                  si vous étiez déjà propriétaire du véhicule à la date de ces contrôles, au centre de contrôle
                  technique qui les a réalisés.
                </li>
                <li>
                  Si une erreur a été commise par ce centre, celui-ci pourra éventuellement vous remettre, s’il le
                  souhaite, un document vous permettant en ce sens.
                </li>
              </ul>

              <p>
                Pour plus d'informations, vous pouvez consulter <a
                  class="fr-link"
                  title="Le site utac-otc.com"
                  href="https://www.utac-otc.com/infos-pratiques/acc%C3%A8s-par-besoin"
                  rel="noopener noreferrer"
                  target="_blank"
                >le site de l'UTAC</a> (Union technique de l'automobile, du motocycle et du cycle).
              </p>
            </DsfrAccordion>
          </li>
        </DsfrAccordionsGroup>
      </div>
    </div>
  </div>

  <div
    v-if="selectedTheme"
    class="fr-grid-row  fr-grid-row--gutters  fr-mb12w"
  >
    <div class="fr-col-12  text-center">
      <HistoVecButtonLink
        icon="ri-mail-line"
        label="Contactez-nous"
        to="/contact"
      />
    </div>
  </div>
</template>

<style scoped>

.text-center {
  text-align: center;
}

</style>

