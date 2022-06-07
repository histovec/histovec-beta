<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'

import FaqSvg from '@/assets/img/faq.svg'
import aideSivImg from '@/assets/img/aide_siv.jpg'
import aideFniImg from '@/assets/img/aide_fni.jpg'



export default defineComponent({
  name: 'FAQPage',

  components: { FaqSvg, HistoVecButtonLink, RouterLink },

  data () {
    return {
      expandedId: undefined,
      tilesVendeursLinks: [
        {
          title: 'Pour les vendeurs',
          description: 'Rassurez vos acheteurs potentiels avec le rapport et obtenez votre certificat de non gage.',
          to: '',
          imgSrc: '',
        },
      ],
      tilesAcheteursLinks: [
        {
          title: 'Pour les acheteurs',
          description: 'Rassurez vos acheteurs potentiels avec le rapport et obtenez votre certificat de non gage.',
          to: '',
          imgSrc: '',
        },
      ],
      images: {
        aideSivImg,
        aideFniImg,
      },
    }
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
            text: 'FAQ & Liens utiles',
          },
        ]"
      />
    </div>

    <div class="fr-col-lg-4  fr-col-xl-4">
      <DsfrPicture src="">
        <FaqSvg
          title="Illustration de la page de la FAQ"
        />
      </DsfrPicture>
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
    <div
      class="fr-grid-row  fr-grid-row--gutters"
      style="margin-bottom: 2rem"
    >
      <div class="fr-col-offset-1  fr-col-5">
        <DsfrTiles
          :tiles="tilesVendeursLinks"
          :horizontal="true"
        />
      </div>
      <div class="fr-col-5">
        <DsfrTiles
          :tiles="tilesAcheteursLinks"
          :horizontal="true"
        />
      </div>
    </div>
  </div>

  <div
    class="fr-grid-row  fr-grid-row--gutters"
    style="margin-bottom: 2rem"
  >
    <div class="fr-col-12">
      <h2>Foire aux Questions</h2>
    </div>

    <div class="fr-col-12">
      <DsfrAccordionsGroup>
        <li>
          <DsfrAccordion
            title="Comment utiliser HistoVec ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <h6>Vous êtes vendeur :</h6>
            <p>
              Sur la page vendeur, remplissez le formulaire pour vous identifier avec les informations demandées, et validez.
              Note : s’il s’agit d’un véhicule d’entreprise, cliquez sur l’onglet “Entreprise”.
            </p>
            <p>
              Le rapport du véhicule est affiché. Vous pouvez consulter les différentes sections sur le menu de gauche.
              Vous pouvez transmettre le lien vers le rapport à un tiers en cliquant sur le menu “Transmettre le rapport”.
            </p>

            <h6>Vous êtes acheteur :</h6>
            <p>Demandez au vendeur de vous transmettre le lien vers le rapport en le générant sur le site HistoVec.</p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="Comment retrouver mon rapport HistoVec ultérieurement ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>
              Le rapport généré est consultable le mois en cours et le mois suivant sa génération, grâce au lien qui a été fourni par le vendeur.
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="A qui s'adresse HistoVec ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <h6>Je vends mon véhicule d’occasion :</h6>
            <p>
              HistoVec vous permet de valoriser votre offre en fournissant gratuitement un rapport d’historique officiel qui rassurera vos acheteurs potentiels. Le certificat de situation administrative détaillée y est également téléchargeable.
            </p>

            <h6>J’achète un véhicule d’occasion :</h6>
            <p>
              HistoVec vous permet de vous informer, de faire un choix éclairé sur les véhicules sélectionnés et d’éviter les mauvaises surprises.
            </p>

            <h6>Je suis un professionnel négociant automobile :</h6>
            <p>
              Fiabilisez et valorisez votre stock de véhicules d’occasion en permettant à votre entreprise et vos clients de vérifier l’historique des véhicules acquis.
            </p>

            <h6>Je loue ma voiture à des particuliers :</h6>
            <p>
              Je peux rassurer mes clients potentiels en fournissant gratuitement un historique officiel du véhicule.
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="D'où proviennent les informations d'HistoVec ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>
              Les informations du rapport sont issues du système d’immatriculation des véhicules (SIV) du ministère de l’Intérieur.
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="Comment consulter le rapport d'un véhicule qui ne m'appartient pas ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>
              Seul le titulaire du certificat d'immatriculation peut générer le rapport HistoVec de son véhicule, qu'il choisit de transmettre à des tiers.
            </p>
            <p>
              Les locataires longue durée (LDD) doivent être mandatés par le propriétaire du véhicule.
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="A qui s'adresse HistoVec ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <h6>Officiel :</h6>
            <p>
              HistoVec est un site produit par le ministère de l’Intérieur et fournit les données du système d’immatriculation des véhicules (SIV).
            </p>

            <h6>Confidentiel :</h6>
            <p>
              Seul le titulaire du certificat d'immatriculation peut générer le rapport HistoVec de son véhicule, qu'il choisit de transmettre à des tiers.
            </p>

            <h6>Gratuit :</h6>
            <p>
              HistoVec est entièrement gratuit pour les vendeurs et les acheteurs. Il s’agit d’un service public pour contribuer à la sécurisation des transactions de véhicules d’occasion.
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="Est-ce que les informations sont complètes ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>
              Seules les informations connues du ministère de l’Intérieur sont fournies. Par exemple, ne sont enregistrés que les sinistres déclarés à l’assureur et pour lesquels un expert a enregistré une procédure VRC (Véhicule à Réparation Contrôlée).
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="Comment corriger une information manquante ou inexacte sur mes données personnelles ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>
              Pour ce faire,
              <router-link
                class="fr-link"
                to="/contact"
              >
                contactez-nous
              </router-link>.
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="Comment corriger une information manquante ou inexacte sur les données de mon véhicule ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>
              Pour ce faire,
              <router-link
                class="fr-link"
                to="/contact"
              >
                contactez-nous
              </router-link>.
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="Comment retrouver mon véhicule ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>
              Vérifiez que <b>vous avez saisi très précisément dans les champs du formulaire</b>, les <b>informations telles qu'elles figurent sur la carte grise</b> (nom et prénom(s), immatriculation, numéro de formule ou date du certificat d'immatriculation).
            </p>
            <p>
              <VIcon
                name="ri-error-warning-fill"
              />
              <b>Vos données sont susceptibles d'avoir fait l'objet d'erreurs lors de la saisie de votre dossier</b>
            </p>
            <p>
              Pour les anciens numéros d'immatriculation, veillez à bien saisir vos nom et prénom(s) dans le même ordre que celui qui apparaît sur la carte grise.
            </p>
            <p>
              Immatriculation au format SIV (AA-123-AA): où trouver les informations sur votre carte grise.
            </p>

            <DsfrPicture
              :src="images.aideSivImg"
              alt="Description de l'emplacement des données sur le certificat d'immatriculation à partir de 2009 (format SIV)"
              title="Description de l'emplacement des données sur le certificat d'immatriculation à partir de 2009 (format SIV)"
            />

            <p>
              Immatriculation au format FNI (123 ABC 45): où trouver les informations sur votre carte grise (plusieurs modèles).
            </p>

            <DsfrPicture
              :src="images.aideFniImg"
              alt="Description de l'emplacement des données sur le certificat d'immatriculation avant 2009 (format FNI)"
              title="Description de l'emplacement des données sur le certificat d'immatriculation avant 2009 (format FNI)"
            />

            <p>
              Pour les locataires longue durée (LDD), dûment mandatés par le propriétaire du véhicule, il convient de renseigner les informations du propriétaire. Par exemple, pour une société de location, cliquez sur l'onglet Entreprise et remplissez le formulaire de recherche.
            </p>

            <p>
              Si votre véhicule est toujours introuvable,
              <router-link
                class="fr-link"
                to="/contact"
              >
                contactez-nous
              </router-link>.
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="Où se trouve le numéro de formule ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>
              Le numéro de formule est situé en bas à gauche de la carte grise. (p. ex. : 2015XX012345)
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="Que signifient les termes des opérations historiques ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>
              - <b>Première immatriculation d'un véhicule neuf</b>, opération d'immatriculation d'un véhicule qui n'a jamais été immatriculé.
            </p>
            <p>
              - <b>Première immatriculation à l'étranger</b>, le véhicule a été immatriculé en tant que véhicule neuf à l'étranger.
            </p>
            <p>
              - <b>Première immatriculation d'un véhicule importé</b>, véhicule déjà immatriculé à l'étranger qui se fait immatriculer en France pour la première fois.
            </p>
            <p>
              - <b>Première immatriculation (source incertaine)</b>, opération fournie à titre indicatif lorsque aucune opération telle que « Première immatriculation d'un véhicule neuf » ou « Première immatriculation à l'étranger » n'est associée à la date présente dans le fichier. Cela peut être dû à l'origine du véhicule (p. ex. anciens véhicules militaires qui disposaient d'une immatriculation spéciale) ou à l'absence de la donnée dans les anciens fichiers d'immatriculation (p. ex. certains véhicules anciens).
            </p>
            <p>
              - <b>Conversion au nouveau format d'immatriculation</b>, changement d'immatriculation d'un véhicule passant du format 1234 ABC 56 au format AB-123-CD.
            </p>
            <p>
              - <b>Cession (vente du véhicule)</b>, véhicule vendu par un particulier ou par un professionnel.
            </p>
            <p>
              - <b>Changement de titulaire</b>, opération correspondant au moment où un particulier effectue sa demande de carte grise pour la mettre à son nom.
            </p>
            <p>
              - <b>Achat ou reprise par un professionnel</b>, opération correspondant au moment où un professionnel devient acquéreur du véhicule.
            </p>
            <p>
              - <b>Fin d'usage démonstration pour vente du véhicule</b>, véhicule de garage ayant servi de véhicule de démonstration.
            </p>
            <p>
              - <b>Opposition au transfert de la carte grise</b>, état bloquant tout changement de titulaire.
            </p>
            <p>
              - <b>Procédure de réparation contrôlée</b>, procédure pendant laquelle les réparations sont contrôlées par un expert en automobile.
            </p>
            <p>
              - <b>Premier rapport d'expert</b>, rapport de l'expert en automobile qui détermine la dangerosité du véhicule, établit la liste des réparations et en évalue le montant.
            </p>
            <p>
              - <b>Second rapport d'expert</b>, rapport de l'expert en automobile qui indique notamment que le véhicule est apte à circuler dans des conditions normales de sécurité.
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="Quelle différence y-a-t-il entre la notion de propriétaire et titulaire ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>
              Propriétaire du véhicule et titulaire du certificat d'immatriculation sont deux notions différentes :
            </p>
            <p>
              <b>Propriétaire</b>: il s'agit du propriétaire du bien qu'est le véhicule et qui peut donc le vendre.
            </p>
            <p>
              <b>Titulaire</b>: il s'agit de la ou les personne(s) titulaire du droit à circuler avec le véhicule.
            </p>
            <p>
              Le propriétaire du véhicule et titulaire du certificat d'immatriculation sont le plus souvent la même personne, mais peuvent être différents. C'est pourquoi, HistoVec distingue les opérations qui correspondent à la vente du véhicule ("cession/vente par un particulier" et "achat/reprise par un professionnel ") du changement de titulaire.
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="Quelle est notre politique de protection des données personnelles ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>
              Vous pouvez les consulter dans les mentions légales.
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="Que dois-je faire pour vendre mon véhicule ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>
              Vendre un véhicule vous impose de remettre certains documents au nouveau propriétaire et d'avertir l'administration via un téléservice. Afin de connaitre les conditions préalables à la vente ainsi que les démarches à entreprendre, nous vous invitons à consulter le site du Service Public
            </p>
            <p>
              Ce que vous pouvez faire grâce à HistoVec:
            </p>
            <ul style="margin-left: 2rem; padding-left: 0">
              <li>
                Transmettre l'historique administratif du véhicule à l'acheteur (en cliquant sur Transmettre le rapport) ;
              </li>
              <li>
                Télécharger le certificat de situation administrative détaillé (CSA ; téléchargeable en cliquant sur Transmettre le rapport).
              </li>
            </ul>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="Que faire si lien du rapport HistoVec que l'on m'a envoyé ne fonctionne pas?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>Le titulaire du véhicule vous a transmis un lien, celui-ci ne fonctionne pas. Les cas suivants peuvent être rencontrés :</p>

            <p>1. Le lien a été probablement mal copié ou transmis - HistoVec vous signale alors une erreur:</p>

            <ul style="margin-left: 2rem; padding-left: 0">
              <li>
                Le lien transmis est incomplet
              </li>
              <li>
                Le rapport a été trouvé, mais la clé pour l'ouvrir est invalide
              </li>
            </ul>
            <p>Pensez à l'alternative de l'envoi par QR-Code si les mails n'ont pas permis d'aboutir.</p>
            <p>
              2. Le rapport n'existe pas, ou n'est plus disponible pour des raisons de sécurité - HistoVec vous signale alors une erreur:
            </p>
            <ul style="margin-left: 2rem; padding-left: 0">
              <li>
                Le rapport ne semble pas ou plus disponible
              </li>
            </ul>
            <b>Dans tous ces cas, il convient de demander à nouveau le rapport à votre vendeur</b>
            <p>
              Si jamais le problème persiste avec votre vendeur :
              <router-link
                class="fr-link"
                to="/contact"
              >
                contactez-nous
              </router-link>.
            </p>
          </DsfrAccordion>
        </li>
        <li>
          <DsfrAccordion
            title="Comment puis-je récupérer le rapport d'un expert en automobile ?"
            :expanded-id="expandedId"
            @expand="expandedId = $event"
          >
            <p>
              Lorsqu'un véhicule a fait l'objet d'une procédure à réparations contrôlées, HistoVec affiche le numéro d'agrément de l'expert en automobile ayant enclenché la procédure et rédigé un premier ou un second rapport d'expertise.
            </p>
            <p>
              En revanche, HistoVec ne peut afficher les détails des rapports (p. ex. éléments à réparer), car ceux-ci ne sont pas transmis en tant que tels dans le système d'immatriculation des véhicules (SIV). Dès lors, si vous achetez le véhicule, n'hésitez pas à demander au vendeur s'il est en possession du rapport d'expertise. Autrement, vous pouvez consulter les coordonnées de l'expert concerné sur la liste nationale mise à jour par le ministère chargé des transports. Cette liste étant régulièrement mise à jour, il est toutefois possible que vous ne trouviez plus l'expert qui a rédigé le rapport, notamment si celui-ci a été radié (sanction, cessation d'activité, retraite, etc.).
            </p>
          </DsfrAccordion>
        </li>
      </DsfrAccordionsGroup>
    </div>
  </div>

  <div
    class="fr-grid-row  fr-grid-row--gutters  fr-mb12w"
  >
    <div
      class="fr-col-12"
      style="text-align: center"
    >
      <HistoVecButtonLink
        id="contactBtn"
        label="Contactez-nous"
        to="/contact"
      />
    </div>
  </div>
</template>
