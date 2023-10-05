import { expect } from '@hapi/code'
import Lab from '@hapi/lab'
import {
  verificationControleTechnique, verificationFormat,
  verificationImmatriculation, verificationsData,
  verificationStatus, verificationVehiculeVole
} from '../../../src/plugins/public-api/handlers/validationData.js'
import {
  reponseApiDataCode200,
  reponseApiDataCode204,
  reponseApiDataCode205,
  reponseApiDataIncomingQueryManquant,
  reponseApiDataIncomingQueryImmatManquant,
  reponseApiDataIncomingQueryImmatDifferent,
  reponseApiDataControleTechniqueImmatManquant,
  reponseApiDataControleTechniqueImmatDifferent,
  reponseApiDataControleTechniqueManquant,
  reponseApiDataVehiculeVole,
  reponseApiDataDateMauvaisFormat
} from '../../fixtures/index.js'

export const lab = Lab.script()
const UUID = 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8'

lab.experiment('verification du status', () => {
  lab.test('status en 200', () => {
    const response = verificationStatus(reponseApiDataCode200.status, UUID)
    expect(response).to.true()
  })
  lab.test('status en 204', () => {
    const response = expect(() => verificationStatus(reponseApiDataCode204.status, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(404)
    expect(response.output.payload.error).to.equal('Not Found')
    expect(response.output.payload.message).to.equal('Véhicule introuvable.')
  })
  lab.test('status autre que 200 et 204 ', () => {
    const response = expect(() => verificationStatus(reponseApiDataCode205.status, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(503)
    expect(response.output.payload.error).to.equal('Service Unavailable')
    expect(response.output.payload.message).to.equal('Service indisponible.')
  })
});

lab.experiment('verification du format de réponse de \'API data', () => {
  lab.test('réponse au bon format', () => {
    const response = verificationFormat(reponseApiDataCode200.payload, UUID)
    expect(response).to.true()
  })
  lab.test('incoming_query manquant', () => {
    const response = expect(() => verificationFormat(reponseApiDataIncomingQueryManquant.payload, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(502)
    expect(response.output.payload.error).to.equal('Bad Gateway')
    expect(response.output.payload.message).to.equal('Un problème est survenu lors de la récupération des informations.')
  })
  lab.test('incoming_query immat manquant', () => {
    const response = expect(() => verificationFormat(reponseApiDataIncomingQueryImmatManquant.payload, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(502)
    expect(response.output.payload.error).to.equal('Bad Gateway')
    expect(response.output.payload.message).to.equal('Un problème est survenu lors de la récupération des informations.')
  })
  lab.test('controle_technique immat manquant', () => {
    const response = expect(() => verificationFormat(reponseApiDataControleTechniqueImmatManquant.payload, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(502)
    expect(response.output.payload.error).to.equal('Bad Gateway')
    expect(response.output.payload.message).to.equal('Un problème est survenu lors de la récupération des informations.')
  })
  lab.test('infos date_premiere_immatriculation mauvais format', () => {
    const response = expect(() => verificationFormat(reponseApiDataDateMauvaisFormat.payload, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(502)
    expect(response.output.payload.error).to.equal('Bad Gateway')
    expect(response.output.payload.message).to.equal('Un problème est survenu lors de la récupération des informations.')
  })
});

lab.experiment('verification du numéro d\'immatriculation', () => {
  lab.test('numéros identiques', () => {
    const response = verificationImmatriculation(reponseApiDataCode200.payload, UUID)
    expect(response).to.true()
  })
  lab.test('numéros différents', () => {
    const response = expect(() => verificationImmatriculation(reponseApiDataIncomingQueryImmatDifferent.payload, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(412)
    expect(response.output.payload.error).to.equal('Precondition Failed')
    expect(response.output.payload.message).to.equal('Un problème est survenu lors de la récupération des informations.')
  })
});

lab.experiment('verification des controles technique', () => {
  lab.test('controles techniques conformes', () => {
    const response = verificationControleTechnique(reponseApiDataCode200.payload, UUID)
    expect(response).to.true()
  })
  lab.test('controles techniques non conformes', () => {
    const response = verificationControleTechnique(reponseApiDataControleTechniqueImmatDifferent.payload, UUID)
    expect(response).to.false()
  })
  lab.test('controles techniques absents', () => {
    const response = verificationControleTechnique(reponseApiDataControleTechniqueManquant.payload, UUID)
    expect(response).to.false()
  })
});

lab.experiment('verification du véhicule vole', () => {
  lab.test('véhicule vole', () => {
    const response = verificationVehiculeVole(reponseApiDataVehiculeVole.payload, UUID)
    expect(response).to.true()
  })
  lab.test('véhicule non vole', () => {
    const response = verificationVehiculeVole(reponseApiDataCode200.payload, UUID)
    expect(response).to.false()
  })
});

lab.experiment('verification global des datas', () => {
  lab.test('cas passant', () => {
    const response = verificationsData(reponseApiDataCode200, UUID)
    expect(response).to.equal({ statusValide: true, formatValide: true, immatriculationValide: true, controleTechniqueValide: true, vehiculeVole: false })
  })
  lab.test('cas status 204', () => {
    const response = expect(() => verificationsData(reponseApiDataCode204, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(404)
    expect(response.output.payload.error).to.equal('Not Found')
    expect(response.output.payload.message).to.equal('Véhicule introuvable.')
  })
  lab.test('cas immatriculations non identiques', () => {
    const response = expect(() => verificationsData(reponseApiDataIncomingQueryImmatDifferent, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(412)
    expect(response.output.payload.error).to.equal('Precondition Failed')
    expect(response.output.payload.message).to.equal('Un problème est survenu lors de la récupération des informations.')
  })
  lab.test('cas controles techniques non conformes', () => {
    const response = verificationsData(reponseApiDataControleTechniqueImmatDifferent, UUID)
    expect(response).to.equal({ statusValide: true, formatValide: true, immatriculationValide: true, controleTechniqueValide: false, vehiculeVole: false })
  })
  lab.test('cas véhicule volé', () => {
    const response = verificationsData(reponseApiDataVehiculeVole, UUID)
    expect(response).to.equal({ statusValide: true, formatValide: true, immatriculationValide: true, controleTechniqueValide: true, vehiculeVole: true })
  })
});
