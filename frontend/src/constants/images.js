// @todo: use lazy loading for images

export {default as logoMiPng} from '@/assets/img/logos-metiers/logo-mi.png'
export {default as securiteRoutiere120Png} from '@/assets/img/logos-metiers/securite-routiere-120.png'

import {default as vignette35CritAir1Png} from '@/assets/img/vignettes-crit-air/35-petit/vignette-1.png'
import {default as vignette35CritAir2Png} from '@/assets/img/vignettes-crit-air/35-petit/vignette-2.png'
import {default as vignette35CritAir3Png} from '@/assets/img/vignettes-crit-air/35-petit/vignette-3.png'
import {default as vignette35CritAir4Png} from '@/assets/img/vignettes-crit-air/35-petit/vignette-4.png'
import {default as vignette35CritAir5Png} from '@/assets/img/vignettes-crit-air/35-petit/vignette-5.png'
import {default as vignette35CritAirElectriquePng} from '@/assets/img/vignettes-crit-air/35-petit/vignette-electrique.png'

export function getVignette35CritAirPng(vignette) {
  switch (vignette) {
    case 1:
      return vignette35CritAir1Png
    case 2:
      return vignette35CritAir2Png
    case 3:
      return vignette35CritAir3Png
    case 4:
      return vignette35CritAir4Png
    case 5:
      return vignette35CritAir5Png
    case 'electrique':
      return vignette35CritAirElectriquePng
    default:
      return null
  }
}

export {default as accueil4Jpg} from '@/assets/img/accueil-4.jpg'

// @todo: refactor image management in faq mail
// export {default as aideFniJpg} from '@/assets/img/aide-fni.jpg'
// export {default as aideSivJpg} from '@/assets/img/aide-siv.jpg'

export {default as anciennePlaqueImmatriculationFdTranspPng} from '@/assets/img/ancienne-plaque-immatriculation-fd-transp.png'
export {default as betaPng} from '@/assets/img/beta.png'
export {default as carteGrise1970Jpg} from '@/assets/img/carte-grise-1970.jpg'
export {default as carteGriseAvant2004Jpg} from '@/assets/img/carte-grise-avant-2004.jpg'
export {default as clavierJpg} from '@/assets/img/clavier.jpg'
export {default as exempleRapportGPng} from '@/assets/img/exemple-rapport-g.png'
export {default as exempleRapportPng} from '@/assets/img/exemple-rapport.png'

// @note: This image is duplicated in static and assets :
// - In static because it need to be publicly exposed to be referenced by mail content.
// - In assets because it need to be managed by webpack to get a static reference while importing the image
//   (however, image can be lost while browsing website because of relative import and routes changes).
export {default as histovecHeaderMobilePng} from '@/assets/img/histovec-header-mobile.png'

// @todo: refactor images loading for CSA PDF generation
export {default as histovecLogoDroiteNamePng} from '@/assets/img/histovec-logo-droite-name.png'
// export {default as histovecLogoDroiteNameSvg} from '@/assets/img/histovec-logo-droite-name.svg'
export {default as logoMiHeaderPng} from '@/assets/img/logo-mi-header.png'
// export {default as LogoMiHeaderSvg} from '@/assets/img/logo-mi-header.svg'

export {default as nFormuleJpg} from '@/assets/img/n-formule.jpg'
export {default as nouvelleCarteGriseJpg} from '@/assets/img/nouvelle-carte-grise.jpg'
export {default as nouvellePlaqueImmatriculationFdTranspPng} from '@/assets/img/nouvelle-plaque-immatriculation-fd-transp.png'
export {default as panneauImpasseSvg} from '@/assets/img/panneau-impasse.svg'
export {default as poigneeDeMainJpg} from '@/assets/img/poignee-de-main.jpg'
// @todo: to keep or not to keep? that is the question
// export {default as poigneeDeMainPng} from '@/assets/img/poignee-de-main.png'

/********** Unused images  **********/

// export {default as vignette50CritAir1Png} from '@/assets/img/vignettes-crit-air/50-petit/vignette-1.png'
// export {default as vignette50CritAir2Png} from '@/assets/img/vignettes-crit-air/50-petit/vignette-2.png'
// export {default as vignette50CritAir3Png} from '@/assets/img/vignettes-crit-air/50-petit/vignette-3.png'
// export {default as vignette50CritAir4Png} from '@/assets/img/vignettes-crit-air/50-petit/vignette-4.png'
// export {default as vignette50CritAir5Png} from '@/assets/img/vignettes-crit-air/50-petit/vignette-5.png'
// export {default as vignette50CritAirElectriquePng} from '@/assets/img/vignettes-crit-air/50-petit/vignette-electrique.png'

// export {default as certificatImmat2Jpg} from '@/assets/img/certificat-immat-2.jpg'

// export {default as histovecLogoDroitePng} from '@/assets/img/histovec-logo-droite.png'
// export {default as histovecLogoDroiteSvg} from '@/assets/img/histovec-logo-droite.svg'
// export {default as histovecLogoGaucheSvg} from '@/assets/img/histovec-logo-gauche.svg'

// export {default as petiteVoitureGPng} from '@/assets/img/petite-voiture-g.png'
// export {default as petiteVoiturePPng} from '@/assets/img/petite-voiture-p.png'

// export {default as qrCodePng} from '@/assets/img/qr-code.png'
// export {default as rapportExemplePng} from '@/assets/img/rapport-exemple.png'
// export {default as rapportPng} from '@/assets/img/rapport.png'
