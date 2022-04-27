// import slugify from '@sindresorhus/slugify'
import slugify from '@/assets/js/slugify.js'

import aideSIV from '@/assets/img/aide_siv.jpg'
import aideFNI from '@/assets/img/aide_fni.jpg'
import store from '@/store/index.js'
import contact from '@/assets/json/contact.json'


const contactHook = (id, subject = contact.subject.default) => {
  return {
    [id]: (e) => {
      e.removeAttribute('href')
      e.onclick = async () => {
        await store.dispatch('toggleContactModal', { subject })
      }
    }
  }
}

export default function () {
  let id = 0

  const faqContent = [
    {
      title: 'Comment utiliser HistoVec ?',
      body: `
        <dl>
          <dt>Vous êtes vendeur :</dt>
          <dd>
            <ol>
              <li>
                Sur la page vendeur, remplissez le formulaire pour vous
                identifier avec les informations demandées, et validez.
                <p class="indented">
                  Note : s’il s’agit d’un véhicule d’entreprise, cliquez
                  sur l’onglet “Entreprise”
                </p>
              </li>
              <li>
                Le rapport du véhicule est affiché. Vous pouvez consulter
                les différentes sections sur le menu de gauche.
              </li>
              <li>
                Vous pouvez transmettre le lien vers le rapport à un tiers
                en cliquant sur le menu “Transmettre le rapport”.
              </li>
            </ol>
          </dd>
          <br/>
          <dt>Vous êtes acheteur :</dt>
          <dd>
            <p class="indented">
              Demandez au vendeur de vous transmettre le lien vers le
              rapport en le générant sur le site HistoVec.
            </p>
          </dd>
        </dl>
      `,
    },
    {
      title: 'Comment retrouver mon rapport HistoVec ultérieurement ?',
      body: `
        <p class="indented">
          Le rapport généré est consultable le mois en cours et le
          mois suivant sa génération, grâce au lien qui a été fourni
          par le vendeur.
        </p>
      `,
    },
    {
      title: 'À qui s’adresse HistoVec ?',
      body: `
        <dl>
          <dt>Je vends mon véhicule d’occasion :</dt>
          <dd>
            <p class="indented">
              HistoVec vous permet de valoriser votre offre en
              fournissant gratuitement un rapport d’historique
              officiel qui rassurera vos acheteurs potentiels.
              Le certificat de situation administrative détaillée
              y est également téléchargeable.
            </p>
          </dd>
          <dt>J’achète un véhicule d’occasion :</dt>
          <dd>
            <p class="indented">
              HistoVec vous permet de vous informer, de faire un choix
              éclairé sur les véhicules sélectionnés et d’éviter les
              mauvaises surprises.
            </p>
          </dd>
          <dt>Je suis un professionnel négociant automobile :</dt>
          <dd>
            <p class="indented">
              Fiabilisez et valorisez votre stock de véhicules
              d’occasion en permettant à votre entreprise et vos
              clients de vérifier l’historique des véhicules acquis.
            </p>
          </dd>
          <dt>Je loue ma voiture à des particuliers :</dt>
          <dd>
            <p class="indented">
              Je peux rassurer mes clients potentiels en fournissant
              gratuitement un historique officiel du véhicule.
            </p>
          </dd>
        </dl>
      `
    },
    {
      title: 'D’où proviennent les informations d’HistoVec ?',
      body: `
        <p class="indented">
          Les informations du rapport sont issues du système
          d’immatriculation des véhicules (SIV) du ministère de
          l’Intérieur.
        </p>
      `
    },
    {
      title: 'Comment consulter le rapport d’un véhicule qui ne m’appartient pas ?',
      body: `
        <p class="indented">
          Seul le titulaire du certificat d'immatriculation peut générer
          le rapport HistoVec de son véhicule, qu'il choisit de transmettre
          à des tiers.
        </p>
        <p class="indented">
          Les locataires longue durée (LDD) doivent être mandatés par
          le propriétaire du véhicule.
        </p>
      `
    },
    {
      title: 'Quelles sont les garanties d’HistoVec ?',
      body: `
        <dl>
          <dt>Officiel :</dt>
          <dd>
            <p class="indented">
              HistoVec est un site produit par le ministère de
              l’Intérieur et fournit les données du système
              d’immatriculation des véhicules (SIV).
            </p>
          </dd>
          <dt>Confidentiel :</dt>
          <dd>
            <p class="indented">
              Seul le titulaire du certificat d'immatriculation
              peut générer le rapport HistoVec de son véhicule,
              qu'il choisit de transmettre à des tiers.
            </p>
          </dd>
          <dt>Gratuit :</dt>
          <dd>
            <p class="indented">
              HistoVec est entièrement gratuit pour les vendeurs et
              les acheteurs. Il s’agit d’un service public pour
              contribuer à la sécurisation des transactions de
              véhicules d’occasion.
            </p>
          </dd>
        </dl>
      `
    },
    {
      title: 'Est-ce que les informations sont complètes ?',
      body: `
        <p class="indented">
          Seules les informations connues du ministère de l’Intérieur
          sont fournies. Par exemple, ne sont enregistrés que les
          sinistres déclarés à l’assureur et pour lesquels un expert a
          enregistré une procédure VRC (Véhicule à Réparation
          Contrôlée).
        </p>
      `
    },
    {
      title: 'Comment corriger une information manquante ou inexacte sur mes données personnelles?',
      body: `
        <p class="indented">
        Pour ce faire,
          <a id="contact_hook_${id}">
            contactez-nous
          </a>
        </p>
      `,
      callbacks: contactHook(`contact_hook_${id++}`, contact.subject.personalData),
    },
    {
      title: 'Comment corriger une information manquante ou inexacte sur les données de mon véhicule?',
      body: `
        <p class="indented">
        Pour ce faire,
          <a
            id="contact_hook_${id}"
          >
            contactez-nous
          </a>
        </p>
      `,
      callbacks: contactHook(`contact_hook_${id++}`, contact.subject.vehicleData),
    },
    {
      title: 'Comment retrouver mon véhicule ?',
      body: `
        <p class="indented">
          Vérifiez que <strong> vous avez saisi très précisément
          dans les champs du formulaire</strong>, les <strong>
          informations telles qu'elles figurent sur la carte grise
          </strong> (nom et prénom(s), immatriculation, numéro de
          formule ou date du certificat d'immatriculation). </strong>
        </p>
        <p class="indented">
          <strong>
            <i class="fa fa-warning color-danger"></i>
            Vos données sont susceptibles d'avoir fait l'objet
            d'erreurs lors de la saisie de votre dossier
            <i class="fa fa-warning color-danger"></i>
          </strong>
        </p>
        <p class="indented">
          Pour les anciens numéros d'immatriculation, veillez à bien
          saisir vos nom et prénom(s) dans le même ordre que celui qui
          apparaît sur la carte grise.
        </p>
        <p class="indented">
          Immatriculation au format SIV (AA-123-AA): où trouver les
          informations sur votre carte grise.
        </p>
        <p class="indented">
          <img
            class="img-responsive"
            src="${aideSIV}"
          />
        </p>
        <br />
        <p class="indented">
          Immatriculation au format FNI (123 ABC 45): où trouver les
          informations sur votre carte grise (plusieurs modèles).
        </p>
        <p class="indented">
          <img
            class="img-responsive"
            src="${aideFNI}"
          />
        </p>
        <br />
        <p class="indented">
          Pour les locataires longue durée (LDD), dûment mandatés par le
          propriétaire du véhicule, il convient de renseigner les informations
          du propriétaire. Par exemple, pour une société de location, cliquez
          sur l'onglet Entreprise et remplissez le formulaire de recherche.
        </p>
        <p class="indented">
          Si votre véhicule est toujours introuvable,
          <a
            id="contact_hook_${id}"
          >contactez-nous</a>.
        </p>
      `,
      callbacks: contactHook(`contact_hook_${id++}`, contact.subject.holderNotFound),
    },
    {
      title: 'Où se trouve le numéro de formule ?',
      body: `
        <p class="indented">
          Le numéro de formule est situé en bas à gauche de la carte
          grise. (p. ex. : 2015XX012345)
        </p>
      `
    },
    {
      title: 'Que signifient les termes des opérations historiques ?',
      body: `
        <p class="indented">
          <strong>- Première immatriculation d'un véhicule neuf,</strong>
          opération d'immatriculation d'un véhicule qui n'a jamais été
          immatriculé.
        </p>
        <p class="indented">
          <strong>- Première immatriculation à l'étranger,</strong> le
          véhicule a été immatriculé en tant que véhicule neuf à
          l'étranger.
        </p>
        <p class="indented">
          <strong>- Première immatriculation d'un véhicule importé,</strong>
          véhicule déjà immatriculé à l'étranger qui se fait
          immatriculer en France pour la première fois.
        </p>
        <p class="indented">
          <strong>- Première immatriculation (source incertaine),</strong>
          opération fournie à titre indicatif lorsque aucune opération
          telle que « Première immatriculation d'un véhicule neuf » ou
          « Première immatriculation à l'étranger » n'est associée à
          la date présente dans le fichier. Cela peut être dû à
          l'origine du véhicule (p. ex. anciens véhicules militaires
          qui disposaient d'une immatriculation spéciale) ou à
          l'absence de la donnée dans les anciens fichiers
          d'immatriculation (p. ex. certains véhicules anciens).
        </p>
        <p class="indented">
          <strong>- Conversion au nouveau format d'immatriculation,</strong>
          changement d'immatriculation d'un véhicule passant du format
          1234 ABC 56 au format AB-123-CD.
        </p>
        <p class="indented">
          <strong>- Cession (vente du véhicule),</strong> véhicule
          vendu par un particulier ou par un professionnel.
        </p>
        <p class="indented">
          <strong>- Changement de titulaire,</strong> opération
          correspondant au moment où un particulier effectue sa
          demande de carte grise pour la mettre à son nom.
        </p>
        <p class="indented">
          <strong>- Achat ou reprise par un professionnel,</strong>
          opération correspondant au moment où un professionnel
          devient acquéreur du véhicule.
        </p>
        <p class="indented">
          <strong>
            - Fin d'usage démonstration pour vente du véhicule,
          </strong>
          véhicule de garage ayant servi de véhicule de démonstration.
        </p>
        <p class="indented">
          <strong>- Opposition au transfert de la carte grise,</strong>
          état bloquant tout changement de titulaire.
        </p>
        <p class="indented">
          <strong>- Procédure de réparation contrôlée,</strong>
          procédure pendant laquelle les réparations sont contrôlées
          par un expert en automobile.
        </p>
        <p class="indented">
          <strong>- Premier rapport d'expert,</strong> rapport de
          l'expert en automobile qui détermine la dangerosité du
          véhicule, établit la liste des réparations et en évalue le
          montant.
        </p>
        <p class="indented">
          <strong>- Second rapport d'expert,</strong> rapport de
          l'expert en automobile qui indique notamment que le véhicule
          est apte à circuler dans des conditions normales de
          sécurité.
        </p>
      `
    },
    {
      title: 'Quelle différence y a-t-il entre la notion de propriétaire et titulaire ?',
      body: `
        <p class="indented">
          Propriétaire du véhicule et titulaire du certificat
          d'immatriculation sont deux notions différentes :
        </p>
        <p class="indented">
          <strong>Propriétaire</strong>: il s'agit du propriétaire du
          bien qu'est le véhicule et qui peut donc le vendre.
        </p>
        <p class="indented">
          <strong>Titulaire</strong>: il s'agit de la ou les
          personne(s) titulaire du droit à circuler avec le véhicule.
        </p>
        <p class="indented">
          Le propriétaire du véhicule et titulaire du certificat
          d'immatriculation sont le plus souvent la même personne,
          mais peuvent être différents. C'est pourquoi, HistoVec
          distingue les opérations qui correspondent à la vente du
          véhicule ("cession/vente par un particulier" et
          "achat/reprise par un professionnel ") du changement de
          titulaire.
        </p>
      `
    },
    {
      title: 'Quelle est notre politique de protection des données personnelles ?',
      body: `
        <p class="indented">
          Vous pouvez les consulter dans les
          <a href="legal">mentions légales.</a>
        </p>
      `
    },
    {
      title: 'Que dois-je faire pour vendre mon véhicule ?',
      body: `
      <p class="indented">
      Vendre un véhicule vous impose de remettre certains documents au nouveau propriétaire
      et d'avertir l'administration via un téléservice. Afin de connaitre les conditions préalables
      à la vente ainsi que les démarches à entreprendre, nous vous invitons à consulter
      le site du <a href="https://www.service-public.fr/particuliers/vosdroits/F1707" rel="noopener noreferrer" target="_blank">Service Public</a>
      </p>
      <p class="indented">
        Ce que vous pouvez faire grâce à HistoVec:
      </p>
      <ul>
        <li>Transmettre l'historique administratif du véhicule à l'acheteur (en cliquant sur Transmettre le rapport) ;</li>
        <li>Télécharger le certificat de situation administrative détaillé (CSA ; téléchargeable en cliquant sur Transmettre le rapport).</li>
      </ul>
      `
    },
    {
      title: 'Que faire si le lien du rapport HistoVec que l\'on m\'a envoyé ne fonctionne pas?',
      body: `
      <p class="indented">
      Le titulaire du véhicule vous a transmis un lien, celui-ci ne fonctionne pas. Les cas suivants peuvent être rencontrés :
      </p>
      <p class="indented">
      1. Le lien a été probablement mal copié ou transmis - HistoVec vous signale alors une erreur:
      </p>
      <ul class="indented">
        <li> Le lien transmis est incomplet </li>
        <li> Le rapport a été trouvé, mais la clé pour l'ouvrir est invalide </li>
      </ul>
      <p class="indented">
      <br />Pensez à l'alternative de l'envoi par QR-Code si les mails n'ont pas permis d'aboutir.
      </p>
      <p class="indented">
      2. Le rapport n'existe pas, ou n'est plus disponible pour des raisons de sécurité - HistoVec vous signale alors une erreur:
      </p>
      <ul class="indented">
          <li> Le rapport ne semble pas ou plus disponible </li>
        </ul>
      </p>
      <p class="indented"> <b> Dans tous ces cas, il convient de demander à nouveau le rapport à votre vendeur </b> </p>
      <p class="indented">
      Si jamais le problème persiste avec votre vendeur :
        <a
          id="contact_hook_${id}"
        >
          contactez-nous
        </a>
      </p>
      `,
      callbacks: contactHook(`contact_hook_${id++}`, contact.subject.buyerNotFound),
    },
    {
      title: 'Comment puis-je récupérer le rapport d\'un expert en automobile ?',
      body: `
      <p class="indented">
      Lorsqu'un véhicule a fait l'objet d'une procédure à réparations contrôlées,
      HistoVec affiche le numéro d'agrément de l'expert en automobile ayant enclenché la procédure
      et rédigé un premier ou un second rapport d'expertise.
      </p>
      <p class="indented">
      En revanche, HistoVec ne peut afficher les détails des rapports (p. ex. éléments à réparer),
      car ceux-ci ne sont pas transmis en tant que tels dans le système d'immatriculation des véhicules (SIV).
      Dès lors, si vous achetez le véhicule, n'hésitez pas à demander au vendeur s'il est en possession du rapport d'expertise.
      Autrement, vous pouvez consulter les coordonnées de l'expert concerné sur la liste nationale mise à jour par le ministère chargé des transports.
      Cette liste étant régulièrement mise à jour, il est toutefois possible que vous ne trouviez plus l'expert qui a rédigé le rapport,
      notamment si celui-ci a été radié (sanction, cessation d'activité, retraite, etc.).
      </p>
      `
    },
  ]

  return faqContent.map(content => ({
    ...content,
    id: slugify(content.title)
  }))
}
