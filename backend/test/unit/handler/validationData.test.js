import { expect } from '@hapi/code'
import Lab from '@hapi/lab'
import {
  verificationControleTechnique,
  verificationImmatriculation, verificationsData,
  verificationStatus, verificationVehiculeVole
} from '../../../src/plugins/public-api/handlers/validationData.js';

export const lab = Lab.script()
const UUID = 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8'

lab.experiment('verification du status', () => {
  lab.test('status en 200', () => {
    const response = verificationStatus(200, UUID)
    expect(response).to.true()
  })
  lab.test('status en 204', () => {
    const response = expect(() => verificationStatus(204, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(404)
    expect(response.output.payload.error).to.equal('Not Found')
    expect(response.output.payload.message).to.equal('Véhicule introuvable.')
  })
  lab.test('status autre que 200 et 204 ', () => {
    const response = expect(() => verificationStatus(205, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(503)
    expect(response.output.payload.error).to.equal('Service Unavailable')
    expect(response.output.payload.message).to.equal('Service indisponible.')
  })
});

lab.experiment('verification du numéro d\'immatriculation', () => {
  const payload = {
    plaq_immat_hash: 'acdd4e99b514a23f9fde338679b4713da59e87621a658f68c08c90a12edcbaea',
    incoming_query: {
      immat: null
    }
  }

  lab.test('numéros identiques', () => {
    payload.incoming_query.immat = 'AA-948-BM'

    const response = verificationImmatriculation(payload, UUID)
    expect(response).to.true()
  })
  lab.test('numéros différents', () => {
    payload.incoming_query.immat = 'AA-948-BB'

    const response = expect(() => verificationImmatriculation(payload, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(412)
    expect(response.output.payload.error).to.equal('Precondition Failed')
    expect(response.output.payload.message).to.equal('Un problème est survenu lors de la récupération des informations.')
  })
  lab.test('numéros d\'immatriculation manquant', () => {
    payload.incoming_query.immat = null

    const response = expect(() => verificationImmatriculation(payload, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(502)
    expect(response.output.payload.error).to.equal('Bad Gateway')
    expect(response.output.payload.message).to.equal('Un problème est survenu lors de la récupération des informations.')
  })
  lab.test('hash de l\'immatriculation manquant', () => {
    payload.incoming_query.immat = null

    const response = expect(() => verificationImmatriculation(payload, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(502)
    expect(response.output.payload.error).to.equal('Bad Gateway')
    expect(response.output.payload.message).to.equal('Un problème est survenu lors de la récupération des informations.')
  })
});

lab.experiment('verification des controles technique', () => {
  const payloadFormat = {
    vehicule: {
      controles_techniques: [
        { ct_immat: 'AA-948-BM' },
        { ct_immat: 'AA-948-BM' },
        { ct_immat: 'AA-948-BM' }
      ]
    },
    incoming_query: { 'immat': 'AA-948-BM' }
  }

  lab.test('controles techniques conformes', () => {
    const payload = { ...payloadFormat }

    const response = verificationControleTechnique(payload, UUID)
    expect(response).to.true()
  })
  lab.test('controles techniques non conformes', () => {
    const payload = {
      ...payloadFormat,
      vehicule: {
        controles_techniques: [
          { ct_immat: 'AA-948-BM' },
          { ct_immat: 'AA-948-BB' },
          { ct_immat: 'AA-948-BM' }
        ]
      },
    }

    const response = verificationControleTechnique(payload, UUID)
    expect(response).to.false()
  })
  lab.test('controles techniques absents', () => {
    const payload = {
      ...payloadFormat,
      vehicule: {
        controles_techniques: []
      },
    }

    const response = verificationControleTechnique(payload, UUID)
    expect(response).to.false()
  })
});

lab.experiment('verification du véhicule vole', () => {
  lab.test('véhicule vole', () => {
    const payload = {
      vehicule: {
        situation_admin: {
          is_veh_vole: true
        }
      }
    }

    const response = verificationVehiculeVole(payload, UUID)
    expect(response).to.true()
  })
  lab.test('véhicule non vole', () => {
    const payload = {
      vehicule: {
        situation_admin: {
          is_veh_vole: false
        }
      }
    }

    const response = verificationVehiculeVole(payload, UUID)
    expect(response).to.false()
  })
});

lab.experiment('verification global des datas', () => {
  const responseInputFormat = {
    status: 200,
    payload: {
      vehicule: {
        situation_admin: {
          is_veh_vole: false
        },
        controles_techniques: [
          { ct_immat: 'AA-948-BM' },
          { ct_immat: 'AA-948-BM' },
          { ct_immat: 'AA-948-BM' }
        ]
      },
      plaq_immat_hash: 'acdd4e99b514a23f9fde338679b4713da59e87621a658f68c08c90a12edcbaea',
      incoming_query: {
        immat: 'AA-948-BM'
      }
    }
  }

  lab.test('cas passant', () => {
    const responseInput = { ...responseInputFormat }
    const response = verificationsData(responseInput, UUID)
    expect(response).to.equal({ statusValide: true, immatriculationValide: true, controleTechniqueValide: true, vehiculeVole: false })
  })
  lab.test('cas status 204', () => {
    const responseInput = { ...responseInputFormat, status: 204 }

    const response = expect(() => verificationsData(responseInput, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(404)
    expect(response.output.payload.error).to.equal('Not Found')
    expect(response.output.payload.message).to.equal('Véhicule introuvable.')
  })
  lab.test('cas immatriculations non identiques', () => {
    const responseInput = {
      ...responseInputFormat,
      payload: {
        ...responseInputFormat.payload,
        incoming_query: {
          immat: 'AA-948-BB'
        }
      }
    }

    const response = expect(() => verificationsData(responseInput, UUID)).to.throw(Error)
    expect(response.data).to.null()
    expect(response.output.statusCode).to.equal(412)
    expect(response.output.payload.error).to.equal('Precondition Failed')
    expect(response.output.payload.message).to.equal('Un problème est survenu lors de la récupération des informations.')
  })
  lab.test('cas controles techniques non conformes', () => {
    const responseInput = {
      ...responseInputFormat,
      payload: {
        ...responseInputFormat.payload,
        vehicule: {
          ...responseInputFormat.payload.vehicule,
          controles_techniques: [
            { ct_immat: 'AA-948-BM' },
            { ct_immat: 'AA-948-BB' },
            { ct_immat: 'AA-948-BM' }
          ]
        }
      }
    }

    const response = verificationsData(responseInput, UUID)
    expect(response).to.equal({ statusValide: true, immatriculationValide: true, controleTechniqueValide: false, vehiculeVole: false })
  })
  lab.test('cas véhicule volé', () => {
    const responseInput = {
      ...responseInputFormat,
      payload: {
        ...responseInputFormat.payload,
        vehicule: {
          ...responseInputFormat.payload.vehicule,
          situation_admin: {
            is_veh_vole: true
          }
        }
      }
    }

    const response = verificationsData(responseInput, UUID)
    expect(response).to.equal({ statusValide: true, immatriculationValide: true, controleTechniqueValide: true, vehiculeVole: true })
  })
});
