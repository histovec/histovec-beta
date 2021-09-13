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

const renderShareCodePartageHistoVecEmailBody = (context) => {
  return `Un titulaire de véhicule vous transmet le code partage HistoVec afin que vous lui proposiez un service.
Voici le code partage HistoVec:

${context.codePartageHistoVec}`
}

export const getShareCodePartageHistoVecEmail = (context) => {
  return {
    recipients: [],
    subject: 'Code partage HistoVec',
    body: renderShareCodePartageHistoVecEmailBody(context)
  }
}
