const renderIdentity = (identity) => {
  if (identity.typePersonne === 'particulier') {
    if (identity.typeImmatriculation === 'fni') {
      const { nom, prenom, plaque, dateCertificat } = identity
      return `Nom (de naissance) et prénom(s): ${nom} ${prenom}
Numéro d'immatriculation: ${plaque}
Date du certificat: ${dateCertificat}`
    }

    if (identity.typeImmatriculation === 'siv') {
      const { nom, prenom, plaque, formule } = identity
      return `Nom (de naissance): ${nom}
Prénom(s): ${prenom}
Numéro d'immatriculation: ${plaque}
Numéro de formule: ${formule}`
    }
  }

  if (identity.typePersonne === 'pro') {
    if (identity.typeImmatriculation === 'fni') {
      const { raisonSociale, siren, plaque, dateCertificat } = identity
      return `Raison sociale: ${raisonSociale}
  Numéro de siren: ${siren}
  Numéro d'immatriculation: ${plaque}
  Date du certificat: ${dateCertificat}`
    }

    if (identity.typeImmatriculation === 'siv') {
      const { raisonSociale, siren, plaque, formule } = identity
      return `Raison sociale: ${raisonSociale}
Numéro de siren: ${siren}
Numéro d'immatriculation: ${plaque}
Numéro de formule: ${formule}`
    }
  }
}

export const renderUserInfosBloc = (context) => {
  const { browser, identity, userId } = context

  // @todo: add enum and label for typePersonne
  const vehicleType = identity.typePersonne === 'pro' ?
    'professionnel'
    : identity.typePersonne === 'particulier' ? 'particulier' : ''

  // @todo: add enum and label for typeImmatriculation
  const typeImmatriculation = identity.typeImmatriculation === 'fni' ?
    'avant 2009'
    : identity.typeImmatriculation === 'siv' ? 'après 2009' : ''

  const identityDescription = renderIdentity(identity)
  const identityBloc = identityDescription ? `
    ${identityDescription}
  ` : ''

  const categoryBloc = vehicleType && typeImmatriculation ?
    `
Catégorie du véhicule: ${vehicleType}
Type d’immatriculation: ${typeImmatriculation}` : ''

  return `


------------------------------------------------------------------------------------------------------------------
Informations automatiquement récoltées par HistoVec.
Grâce à ces informations nous pourrons vous aider plus rapidement et efficacement :
${categoryBloc}
${identityBloc}
Numéro de session HistoVec: ${userId}
Navigateur: ${browser.name} ${browser.version} ${browser.os}
------------------------------------------------------------------------------------------------------------------
`
}

const renderShareReportEmailBody = (context) => {
  return `Un titulaire de véhicule vous transmet un rapport HistoVec.

Rendez-vous sur le lien suivant pour le consulter:
${context.reportUrl}`
}

export const getShareReportEmail = (context) => {
  return {
    recipients: [],
    subject: 'Rapport HistoVec',
    body: renderShareReportEmailBody(context)
  }
}
