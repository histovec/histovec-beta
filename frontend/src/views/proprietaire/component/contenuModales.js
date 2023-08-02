export const modalesTemplates = {
  nom: {
    libelle: 'nom',
    ref: 'modalSivNom',
    titre: 'Où trouver le nom ?',
    origine: 'buttonSivNom',
    contenue: `<img
          alt="Indication localisation nom : au dessus du prénom"
          src="/histovec/src/assets/img/aide/siv_nom.jpg"
          class="fr-responsive-img"
        />`,
  },
  prenom: {
    libelle: 'prenom',
    ref: 'modalSivPrenoms',
    titre: 'Où trouver le(s) prénom(s) ?',
    origine: 'buttonSivPrenoms',
    contenue: `<img
          alt="Indication localisation prenom(s) : en dessous du nom"
          src="/histovec/src/assets/img/aide/siv_prenoms.jpg"
          class="fr-responsive-img"
        />`,
  },
  nomPrenom: {
    libelle: 'nomPrenom',
    ref: 'modalFniNomEtPrenoms',
    titre: 'Où trouver le nom et le(s) prénom(s) ?',
    origine: 'buttonFniNomEtPrenoms',
    contenue: `<img
          alt="Indication localisation nom et prénom(s) : sous le numéro d'immatriculation"
          src="/histovec/src/assets/img/aide/fni_nom_et_prenoms.jpg"
          class="fr-responsive-img"
        />`,
  },
  numeroSiren: {
    libelle: 'numeroSiren',
    ref: 'modalNumeroSiren',
    titre: `Où trouver le numéro de S${String.fromCharCode(8203)}I${String.fromCharCode(8203)}R${String.fromCharCode(8203)}E${String.fromCharCode(8203)}N ?`,
    origine: 'buttonNumeroSiren',
    contenue: `<p class="fr-text--md">
          Le <span class="fr-text--bleu">numéro S&#8203;I&#8203;R&#8203;E&#8203;N</span> correspond au <span class="fr-text--bleu">9 premiers caractères du numéro SIRET</span>
          de votre société.
        </p>
        <p class="fr-text--md">
          Il figure sur le <span class="fr-text--bleu">K&#8203;B&#8203;I&#8203;S&#8203;</span> de votre société.
        </p>
        <p class="fr-text--md">
          Vous pouvez aussi l'obtenir sur le site
          <a
            class="fr-link"
            title="Le site de societe.com"
            href="https://www.societe.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            societe.com
          </a>
          en effectuant une <span class="fr-text--bleu">recherche avec le nom de votre société</span>.
        </p>
        <p class="fr-text--md">
          En tant qu'association ou collectivité locale, il se peut que vous n'ayez <span class="fr-text--bleu">pas de numéro de S&#8203;I&#8203;R&#8203;E&#8203;N</span>.
        </p>
        <p class="fr-text--md">
          Dans ce cas, <span class="fr-text--bleu">laissez le champs S&#8203;I&#8203;R&#8203;E&#8203;N vide</span>.
        </p>`,
  },
  sivNumeroImmatriculation: {
    libelle: 'sivNumeroImmatriculation',
    ref: 'modalSivNumeroImmatriculation',
    titre: 'Où trouver le numéro d\'immatriculation ?',
    origine: 'buttonSivNumeroImmatriculation',
    contenue: `<img
          alt="Indication localisation numéro d'immatriculation : au dessus du numéro de formule"
          src="/histovec/src/assets/img/aide/siv_plaque_immatriculation.jpg"
          class="fr-responsive-img"
        />`,
  },
  fniNumeroImmatriculation: {
    libelle: 'fniNumeroImmatriculation',
    ref: 'modalFniNumeroImmatriculation',
    titre: 'Où trouver le numéro d\'immatriculation ?',
    origine: 'buttonFniNumeroImmatriculation',
    contenue: `<img
          alt="Indication localisation numéro d'immatriculation : au dessus du nom et prénom"
          src="/histovec/src/assets/img/aide/fni_plaque_immatriculation.jpg"
          class="fr-responsive-img"
        />`,
  },
  numeroFormule: {
    libelle: 'numeroFormule',
    ref: 'modalSivNumeroFormule',
    titre: 'Où trouver le numéro de formule ?',
    origine: 'buttonSivNumeroImmatriculation',
    contenue: `<img
          alt="Indication localisation numéro de formule : sous le numéro d'immatriculation ou dans la bande MRZ ou sur la première page du certificat d'immatriculation"
          src="/histovec/src/assets/img/aide/siv_numero_formule.jpg"
          class="fr-responsive-img"
        />`,
  },
  dateEmission: {
    libelle: 'dateEmission',
    ref: 'modalFniDateEmissionCertificatImmatriculation',
    titre: 'Où trouver la date d\'émission du certificat d\'immatriculation ?',
    origine: 'buttonFniDateEmissionCertificatImmatriculation',
    contenue: `<img
          alt="Indication localisation date du certificat d'immatriculation : à droite du numéro d'immatriculation"
          src="/histovec/src/assets/img/aide/fni_date_emission_certificat_immatriculation.jpg"
          class="fr-responsive-img"
        />`,
  },
}
