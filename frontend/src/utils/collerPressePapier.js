import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '@/constants/type.js'

export function collerPressePapier(formData) {
  let dataCopie = navigator.clipboard.readText()
  let dataSplite
  dataCopie.then(dataPromise => {dataSplite = dataPromise.toString().replace(/\s*$/, '').split(/\t+/)

    if (dataSplite.length > 1) {
      if (formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
        if (formData.typePersonne === TYPE_PERSONNE.PARTICULIER) {
          formData.siv.titulaire.particulier.nom = dataSplite[0]
          formData.siv.titulaire.particulier.prenoms = dataSplite[1]
        }
        if (formData.typePersonne === TYPE_PERSONNE.PRO) {
          formData.siv.titulaire.personneMorale.raisonSociale = dataSplite[0]
          formData.siv.titulaire.personneMorale.numeroSiren = dataSplite[1]
        }
        formData.siv.numeroImmatriculation = dataSplite[2]
        formData.siv.numeroFormule = dataSplite[3]
      }
      if (formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
        if (formData.typePersonne === TYPE_PERSONNE.PARTICULIER) {
          formData.fni.titulaire.particulier.nomEtPrenoms = dataSplite[0]
          formData.fni.numeroImmatriculation = dataSplite[1]
          formData.fni.dateEmissionCertificatImmatriculation = dataSplite[2]
        }
        if (formData.typePersonne === TYPE_PERSONNE.PRO) {
          formData.fni.titulaire.personneMorale.raisonSociale = dataSplite[0]
          formData.fni.titulaire.personneMorale.numeroSiren = dataSplite[1]
          formData.fni.numeroImmatriculation = dataSplite[2]
          formData.fni.dateEmissionCertificatImmatriculation = dataSplite[3]
        }
      }
    }
  })
}
