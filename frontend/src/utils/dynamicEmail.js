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
