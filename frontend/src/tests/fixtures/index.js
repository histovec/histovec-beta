// reponse back OK
import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'
import { reponseRequeteApiSivParticulier200SansGages } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200SansGages'
import { reponseRequeteApiSivParticulier200SansDvs } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200SansDvs'
import { reponseRequeteApiSivParticulier200SansSuspensions } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200SansSuspensions'
import { reponseRequeteApiSivParticulier200SansOppositions } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200SansOppositions'
import { reponseRequeteApiSivProfessionnel200 } from '@/tests/fixtures/api/reponseRequeteApiSivProfessionnel200'
import { reponseRequeteApiIvtParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiIvtParticulier200'
import { reponseRequeteApiIvtProfessionnel200 } from '@/tests/fixtures/api/reponseRequeteApiIvtProfessionnel200'
import { reponseRequeteApiCode200 } from '@/tests/fixtures/api/reponseRequeteApiCode200'
import { reponseRequeteApiSivParticulier200DonneesManquantes } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200DonneesManquantes'
import { reponseRequeteApiSivParticulier200DonneesInconnues } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200DonneesInconnues'

// reponse back KO
import { reponseRequeteApi404 } from '@/tests/fixtures/api/reponseRequeteApi404'
import { reponseRequeteApiErreur500 } from '@/tests/fixtures/api/reponseRequeteApi500'

// reponse mapped
import { reponseSivParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200'
import { reponseSivParticulierFormat200SansGages } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200SansGages'
import { reponseSivParticulierFormat200SansDvs } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200SansDvs'
import { reponseSivParticulierFormat200SansSuspensions } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200SansSuspensions'
import { reponseSivParticulierFormat200SansOppositions } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200SansOppositions'
import { reponseSivProfessionnelFormat200 } from '@/tests/fixtures/api/mapper/reponseSivProfessionnelFormat200'
import { reponseIvtParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseIvtParticulierFormat200'
import { reponseIvtProfessionnelFormat200 } from '@/tests/fixtures/api/mapper/reponseIvtProfessionnelFormat200'
import { reponseCodeFormat200 } from '@/tests/fixtures/api/mapper/reponseCodeFormat200'
import { reponseSivParticulierFormat200DonneesInconnues } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200DonneesInconnues'

// reponse format
import { dataSivParticulierFormat200 } from '@/tests/fixtures/api/format/dataSivParticulierFormat200'
import { dataSivParticulierFormat200SansGages } from '@/tests/fixtures/api/format/dataSivParticulierFormat200SansGages'
import { dataSivParticulierFormat200SansDvs } from '@/tests/fixtures/api/format/dataSivParticulierFormat200SansDvs'
import { dataSivParticulierFormat200SansSuspensions } from '@/tests/fixtures/api/format/dataSivParticulierFormat200SansSuspensions'
import { dataSivParticulierFormat200SansOppositions } from '@/tests/fixtures/api/format/dataSivParticulierFormat200SansOppositions'
import { dataSivParticulierFormat200DonneesInconnues } from '@/tests/fixtures/api/format/dataSivParticulierFormat200DonneesInconnues'

// reponse Authentification
import { reponseAuthentification200 } from '@/tests/fixtures/api/authentification/reponseAuthentification200'
import { reponseAuthentification500 } from '@/tests/fixtures/api/authentification/reponseAuthentification500'
import { reponseAuthentification403 } from '@/tests/fixtures/api/authentification/reponseAuthentification403'

export {
  // reponse back OK
  reponseRequeteApiSivParticulier200,
  reponseRequeteApiSivParticulier200SansGages,
  reponseRequeteApiSivParticulier200SansDvs,
  reponseRequeteApiSivParticulier200SansSuspensions,
  reponseRequeteApiSivParticulier200SansOppositions,
  reponseRequeteApiSivProfessionnel200,
  reponseRequeteApiIvtParticulier200,
  reponseRequeteApiIvtProfessionnel200,
  reponseRequeteApiCode200,
  reponseRequeteApiSivParticulier200DonneesManquantes,
  reponseRequeteApiSivParticulier200DonneesInconnues,
  // reponse back KO
  reponseRequeteApi404,
  reponseRequeteApiErreur500,
  // reponse mapped
  reponseSivParticulierFormat200,
  reponseSivParticulierFormat200SansGages,
  reponseSivParticulierFormat200SansDvs,
  reponseSivParticulierFormat200SansSuspensions,
  reponseSivParticulierFormat200SansOppositions,
  reponseSivProfessionnelFormat200,
  reponseIvtParticulierFormat200,
  reponseIvtProfessionnelFormat200,
  reponseCodeFormat200,
  reponseSivParticulierFormat200DonneesInconnues,
  // reponse format
  dataSivParticulierFormat200,
  dataSivParticulierFormat200SansGages,
  dataSivParticulierFormat200SansDvs,
  dataSivParticulierFormat200SansSuspensions,
  dataSivParticulierFormat200SansOppositions,
  dataSivParticulierFormat200DonneesInconnues,
  // reponse Authentification
  reponseAuthentification200,
  reponseAuthentification500,
  reponseAuthentification403,
}
