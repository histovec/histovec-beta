import { expect } from '@hapi/code'
import Lab from '@hapi/lab'
import { historiqueMapping } from '../../../../../src/plugins/public-api/util/mapper.js';

export const lab = Lab.script()

lab.experiment('verification du mapping', () =>{
  lab.test('doit mapper historique', () => {
    const historique = [
      {
      opa_date: '28/04/2023',
      opa_type: 'CUMUL_OPERATIONS',
      },
      {
        opa_date: '28/04/2023',
        opa_type: 'IMMAT_DIPLO_DEMANDE',
      }
      ]
    const historiqueMappee = [
      {
        date: '28/04/2023',
        type: 'Cumul de plusieurs actions'
      },
      {
        date: '28/04/2023',
        type: 'Demande d\'immatriculation diplomatique'
      }
    ]

    const historiqueMap = historiqueMapping(historique)

    expect(historiqueMap).to.equals(historiqueMappee)
  })
});
