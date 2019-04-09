<template>
  <div>
    <!-- breadcrumb start -->
    <div class="breadcrumb-container">
      <div class="container">
        <ol class="breadcrumb">
          <li>
            <i class="fa fa-home pr-10"></i>
            <a href="home">Accueil</a>
          </li>
          <li class="active">
            Besoin d'aide
          </li>
        </ol>
      </div>
    </div>
    <!-- breadcrumb end -->
    <!-- section -->
    <section class="main-container">
      <div class="container">
        <div class="row">
          <!-- section start -->
          <section
            class="dark-translucent-bg"
            style="background-image:url(assets/images/poignee_de_main.jpg); background-position: 50% 50%"
          >
            <div class="container">
              <div class="row justify-content-lg-center">
                <div class="col-lg-12">
                  <h2 class="text-center mt-4">
                    <div>
                      <strong>Achetez</strong> en confiance un
                      <strong>véhicule d'occasion</strong>
                    </div>
                  </h2>
                  <div class="separator with-icon">
                    <i class="fa fa-car bordered"></i>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <!-- section end -->
        </div>
      </div>
    </section>
    <!-- section -->
    <!-- main-container start -->
    <section class="main-container">
      <div class="container">
        <div class="row">
          <!-- main start -->
          <div class="main col-md-12">
            <!-- page-title start -->
            <h3 class="title">
              <span class="text-defaut">B</span>esoin d'aide
            </h3>
            <div class="separator-2"></div>
            <!-- page-title end -->
          </div>
          <!-- main end -->
        </div>
      </div>
    </section>
    <div class="container">
      <div class="row">
        <div class="col-lg-12 mb-20">
          <p>
            Voici les questions les plus fréquemment posées. Si vous ne trouvez
            pas dans cette liste la réponse à votre interrogation,
            <a
              :href="
                'mailto:histovec@interieur.gouv.fr?subject=Besoin%20d%20aide'
              "
            >contactez-nous</a>
          </p>
          <!-- accordion start -->
          <ul class="panel-group collapse-style-2">
            <accordion-item
              title="Comment utiliser HistoVec?"
              :active="true"
              @click="choose('a')"
            >
              <dl>
                <dt>Vous êtes vendeur :</dt>
                <dd>
                  <ol>
                    <li>
                      sur la page vendeur, remplissez le formulaire pour vous
                      identifier avec les informations demandées, et validez.
                      <p class="indented">
                        Note : s’il s’agit d’un véhicule d’entreprise, cliquez
                        sur l’onglet “Entreprise”
                      </p>
                    </li>
                    <li>
                      le rapport du véhicule est affiché. Vous pouvez consulter
                      les différentes sections sur le menu de gauche.
                    </li>
                    <li>
                      vous pouvez transmettre le lien vers le rapport à un tiers
                      en cliquant sur le menu “Transmettre le rapport”.
                    </li>
                  </ol>
                </dd>
                <dt>Vous êtes acheteur :</dt>
                <dd>
                  <p class="indented">
                    Demandez au vendeur de vous transmettre le lien vers le
                    rapport en le générant sur le site Histovec.
                  </p>
                </dd>
              </dl>
            </accordion-item>
          </ul>
          <!-- accordion end -->
          <!-- accordion start -->
          <!-- ================ -->
          <ul
            id="accordion-2"
            class="panel-group collapse-style-2"
          >
            <!-- debut question 1 -->
            <li
              id="a"
              class="panel panel-default"
            >
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a
                    href="#a"
                    class="clickable"
                    :class="[{ collapsed: choice != 'a' }]"
                    @click="choose('a')"
                  >
                    <i class="fa fa-file-text-o pr-10"></i>
                    Comment utiliser HistoVec ?
                  </a>
                </h4>
              </div>
              <div
                class="panel-collapse collapse"
                :class="[{ in: choice === 'a' }]"
              >
                <div class="panel-body">
                  <dl>
                    <dt>Vous êtes vendeur :</dt>
                    <dd>
                      <ol>
                        <li>
                          sur la page vendeur, remplissez le formulaire pour
                          vous identifier avec les informations demandées, et
                          validez.
                          <p class="indented">
                            Note : s’il s’agit d’un véhicule d’entreprise,
                            cliquez sur l’onglet “Entreprise”
                          </p>
                        </li>
                        <li>
                          le rapport du véhicule est affiché. Vous pouvez
                          consulter les différentes sections sur le menu de
                          gauche.
                        </li>
                        <li>
                          vous pouvez transmettre le lien vers le rapport à un
                          tiers en cliquant sur le menu “Transmettre le
                          rapport”.
                        </li>
                      </ol>
                    </dd>
                    <dt>Vous êtes acheteur :</dt>
                    <dd>
                      <p class="indented">
                        Demandez au vendeur de vous transmettre le lien vers le
                        rapport en le générant sur le site Histovec.
                      </p>
                    </dd>
                  </dl>
                </div>
              </div>
            </li>
            <!-- fin question 1 -->
            <!-- debut question 2 -->
            <li
              id="b"
              class="panel panel-default"
            >
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a
                    href="#b"
                    class="clickable"
                    :class="[{ collapsed : choice !== 'b' }]"
                    @click="choose('b')"
                  >
                    <i class="fa fa-file-text-o pr-10"></i>
                    Comment retrouver mon rapport HistoVec ultérieurement ?
                  </a>
                </h4>
              </div>
              <div
                class="panel-collapse collapse"
                :class="[{ in: choice === 'b' }]"
              >
                <div class="panel-body">
                  <p class="indented">
                    Le rapport généré est consultable le mois en cours et le
                    mois suivant sa génération, grâce au lien qui a été fourni
                    par le vendeur.
                  </p>
                </div>
              </div>
            </li>
            <!-- fin question 2 -->
            <!-- debut question 3 -->
            <li
              id="c"
              class="panel panel-default"
            >
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a
                    href="#c"
                    class="clickable"
                    :class="[{ collapsed: choice !== 'c' }]"
                    @click="choose('c')"
                  >
                    <i class="fa fa-file-text-o pr-10"></i>
                    A qui s’adresse HistoVec ?
                  </a>
                </h4>
              </div>
              <div
                class="panel-collapse collapse"
                :class="[{ in: choice === 'c' }]"
              >
                <div class="panel-body">
                  <dl>
                    <dt>Je vends mon véhicule d’occasion :</dt>
                    <dd>
                      <p class="indented">
                        HistoVec vous permet de valoriser votre offre en
                        fournissant gratuitement un rapport d’historique
                        officiel qui rassurera vos acheteurs potentiels.
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
                </div>
              </div>
            </li>
            <!-- fin question 3 -->
            <!-- debut question 4 -->
            <li
              id="d"
              class="panel panel-default"
            >
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a
                    href="#d"
                    class="clickable"
                    :class="[{ collapsed: choice !== 'd' }]"
                    @click="choose('d')"
                  >
                    <i class="fa fa-file-text-o pr-10"></i>
                    D’où proviennent les informations d’HistoVec ?
                  </a>
                </h4>
              </div>
              <div
                class="panel-collapse collapse"
                :class="[{ in: choice === 'd' }]"
              >
                <div class="panel-body">
                  <p class="indented">
                    Les informations du rapport sont issues du système
                    d’immatriculation des véhicules (SIV) du ministère de
                    l’intérieur.
                  </p>
                </div>
              </div>
            </li>
            <!-- fin question 4 -->
            <!-- debut question 5 -->
            <li
              id="e"
              class="panel panel-default"
            >
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a
                    href="#e"
                    class="clickable"
                    :class="[{ collapsed: choice !== 'e' }]"
                    @click="choose('e')"
                  >
                    <i class="fa fa-file-text-o pr-10"></i>
                    Comment consulter le rapport d’un véhicule qui ne
                    m’appartient pas ?
                  </a>
                </h4>
              </div>
              <div
                class="panel-collapse collapse"
                :class="[{ in: choice === 'e' }]"
              >
                <div class="panel-body">
                  <p class="indented">
                    Seul le propriétaire du certificat d’immatriculation peut
                    générer le rapport HistoVec de son véhicule, qu’il choisit
                    de transmettre à des tiers.
                  </p>
                </div>
              </div>
            </li>
            <!-- fin question 5 -->
            <!-- debut question 6 -->
            <li
              id="f"
              class="panel panel-default"
            >
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a
                    href="#f"
                    class="clickable"
                    :class="[{ collapsed: choice !== 'f' }]"
                    @click="choose('f')"
                  >
                    <i class="fa fa-file-text-o pr-10"></i>
                    Quelles sont les garanties d’HistoVec ?
                  </a>
                </h4>
              </div>
              <div
                class="panel-collapse collapse"
                :class="[{ in: choice === 'f' }]"
              >
                <div class="panel-body">
                  <dl>
                    <dt>Officiel :</dt>
                    <dd>
                      <p class="indented">
                        HistoVec est un site produit par le ministère de
                        l’intérieur et fournit les données du système
                        d’immatriculation des véhicules (SIV).
                      </p>
                    </dd>
                    <dt>Confidentiel :</dt>
                    <dd>
                      <p class="indented">
                        Seul le propriétaire du certificat d’immatriculation
                        peut générer le rapport HistoVec de son véhicule, qu’il
                        choisit de transmettre à des tiers.
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
                </div>
              </div>
            </li>
            <!-- fin question 6 -->
            <!-- debut question 7 -->
            <li
              id="g"
              class="panel panel-default"
            >
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a
                    href="#g"
                    class="clickable"
                    :class="[{ collapsed: choice !== 'g' }]"
                    @click="choose('g')"
                  >
                    <i class="fa fa-file-text-o pr-10"></i>
                    Est-ce que les informations sont complètes ?
                  </a>
                </h4>
              </div>
              <div
                class="panel-collapse collapse"
                :class="[{ in: choice === 'g' }]"
              >
                <div class="panel-body">
                  <p class="indented">
                    Seules les informations connues du Ministère de l’Intérieur
                    sont fournies. Par exemple, ne sont enregistrés que les
                    sinistres déclarés à l’assureur et pour lesquels un expert a
                    enregistré une procédure VRC (Véhicule à Réparation
                    Contrôlée).
                  </p>
                </div>
              </div>
            </li>
            <!-- fin question 7 -->
            <!-- debut question8 -->
            <li
              id="h"
              class="panel panel-default"
            >
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a
                    href="#h"
                    class="clickable"
                    :class="[{ collapsed: choice !== 'h' }]"
                    @click="choose('h')"
                  >
                    <i class="fa fa-file-text-o pr-10"></i>
                    Comment signaler une information manquante ou inexacte ?
                  </a>
                </h4>
              </div>
              <div
                class="panel-collapse collapse"
                :class="[{ in: choice === 'h' }]"
              >
                <div class="panel-body">
                  <p class="indented">
                    <a
                      :href="
                        'mailto:histovec@interieur.gouv.fr?subject=Signaler%20une%20erreur'
                      "
                    >contactez-nous</a>
                  </p>
                </div>
              </div>
            </li>
            <!-- fin question 9 -->
            <!-- debut question 9 -->
            <li
              id="i"
              class="panel panel-default"
            >
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a
                    href="#i"
                    class="clickable"
                    :class="[{ collapsed: choice !== 'i' }]"
                    @click="choose('i')"
                  >
                    <i class="fa fa-file-text-o pr-10"></i>
                    Je ne trouve pas mon véhicule ?
                  </a>
                </h4>
              </div>
              <div
                class="panel-collapse collapse"
                :class="[{ in: choice === 'i' }]"
              >
                <div class="panel-body">
                  <p class="indented">
                    Vérifiez que vous avez saisi très précisément dans les
                    champs du formulaire les informations telles qu'elles
                    figurent sur la carte grise (nom et prénom(s),
                    immatriculation, numéro de formule ou date du certificat
                    d'immatriculation).
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
                      src="assets/images/aide_siv.jpg"
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
                      src="assets/images/aide_fni.jpg"
                    />
                  </p>
                  <br />
                  <p class="indented">
                    Si vous êtes locataire longue durée du véhicule, essayez
                    avec les informations du titulaire propriétaire (par exemple
                    pour une société de location, cliquez sur l'onglet
                    Entreprise du formulaire pour remplir les informations
                    correspondantes).
                  </p>
                  <p class="indented">
                    Il se peut aussi qu'il y ait une erreur sur la date de
                    naissance enregistrée dans le système d’immatriculation des
                    véhicules (SIV) :
                    <a
                      :href="
                        'mailto:histovec@interieur.gouv.fr?subject=Je%20ne%20trouve%20pas%20mon%20vehicule&body=' +
                          mailBody
                      "
                    >contactez-nous</a>.
                  </p>
                </div>
              </div>
            </li>
            <!-- fin question 9 -->
            <!-- debut question 10 -->
            <li
              v-if="false"
              id="j"
              class="panel panel-default"
            >
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a
                    href="#j"
                    class="clickable"
                    :class="[{ collapsed: choice !== 'j' }]"
                    @click="choose('j')"
                  >
                    <i class="fa fa-file-text-o pr-10"></i>
                    Je ne trouve pas le numéro de formule ?
                  </a>
                </h4>
              </div>
              <div
                class="panel-collapse collapse"
                :class="[{ in: choice === 'j' }]"
              >
                <div class="panel-body">
                  <p class="indented">
                    Le numéro de formule est situé en bas à gauche de la carte
                    grise. (p. ex. : 2015XX012345)
                  </p>
                </div>
              </div>
            </li>
            <!-- fin question 10 -->
            <!-- debut question 11 -->
            <li
              id="k"
              class="panel panel-default"
            >
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a
                    href="#k"
                    class="clickable"
                    :class="[{ collapsed: choice !== 'k' }]"
                    @click="choose('k')"
                  >
                    <i class="fa fa-file-text-o pr-10"></i>
                    Que signifient les termes des opérations historiques ?
                  </a>
                </h4>
              </div>
              <div
                class="panel-collapse collapse"
                :class="[{ in: choice === 'k' }]"
              >
                <div class="panel-body">
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
                </div>
              </div>
            </li>
            <li
              id="l"
              class="panel panel-default"
            >
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a
                    href="#l"
                    class="clickable"
                    :class="[{ collapsed: choice !== 'l' }]"
                    @click="choose('l')"
                  >
                    <i class="fa fa-file-text-o pr-10"></i>
                    Quelle différence y a-t-il entre la notion de propriétaire
                    et titulaire ?
                  </a>
                </h4>
              </div>
              <div
                class="panel-collapse collapse"
                :class="[{ in: choice === 'l' }]"
              >
                <div class="panel-body">
                  <p class="indented">
                    Propriétaire du véhicule et titulaire du certificat
                    d'immatriculation sont deux notions différentes :
                  </p>
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
                    mais peuvent être différents. C'est pourquoi, Histovec
                    distingue les opérations qui correspondent à la vente du
                    véhicule ("cession/vente par un particulier" et
                    "achat/reprise par un professionnel ") du changement de
                    titulaire.
                  </p>
                </div>
              </div>
            </li>
            <li
              id="z"
              class="panel panel-default"
            >
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a
                    href="#z"
                    class="clickable"
                    :class="[{ collapsed: choice !== 'z' }]"
                    @click="choose('z')"
                  >
                    <i class="fa fa-file-text-o pr-10"></i>
                    Quelle est la politique de protection des données
                    personnelles ?
                  </a>
                </h4>
              </div>
              <div
                class="panel-collapse collapse"
                :class="[{ in: choice === 'z' }]"
              >
                <div class="panel-body">
                  <p class="indented">
                    Vous pouvez les consulter dans
                    <a href="legal">mentions légales.</a>
                  </p>
                </div>
              </div>
            </li>
          </ul>
          <!-- accordion end -->
        </div>
      </div>
      <!-- row -->
    </div>
    <!-- container -->
  </div>
</template>

<script>
import AccordionItem from '@/components/infos/AccordionItem'
export default {
  components: {
    AccordionItem,
  },

  data() {
    return {
      choice:
        window.location.href.split('#')[1] !== undefined
          ? window.location.href.split('#')[1]
          : '',
    }
  },

  computed: {
    mailBody() {
      var text = encodeURI(
        'Bonjour,\n\nL\'équipe HistoVec vous remercie d\'avoir utilisé le site, votre recherche a été infructueuse, nous sommes désolés pour ce désagrément.\n Histovec n\'est pas supporté par des navigateurs trop anciens, nous vous conseillons l\'utilisation de versions récentes de Firefox ou chrome.\n\nPour vous aider, nous avons besoin des informations que vous avez utilisé pour consulter l\'historique de votre véhicule.\n\nPour un particulier \nNom (de naissance): \nPrénom(s): \nDate de naissance (du titulaire): \nNuméro d\'immatriculation: \nNuméro de formule: \nou\nDate du certificat (FNI avant 2009):\n\nPour une entreprise\nRaison sociale: \nNuméro de siren: \nNuméro d\'immatriculation: \nNuméro de formule:\nou\nDate du certificat (FNI avant 2009):\n\n\nNous pourrons ainsi vous répondre rapidement',
      )
      return text
    },
  },

  created() {
    this.$http
      .put(
        this.apiUrl +
          'log/' +
          this.$cookie.get('userId') +
          '/' +
          this.$route.path.replace(/^\/\w+\//, ''),
      )
      .then(() => {}, () => {})
  },

  methods: {
    choose(id) {
      if (this.choice === id) {
        this.choice = ''
      } else {
        this.choice = id
      }
    },
  },
}
</script>

<style lang='scss' scoped>
.indented {
  margin-left: 40px;
}

// TODO: renommer en accordion
.panel-group {
  list-style: none;
  padding-left: 0;
}
</style>
