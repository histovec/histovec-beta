import { CARROSSERIE_NAT } from '../../constants/vehicle/carrosserieNat'
import { GENRE } from '../../constants/vehicle/genre'
import { USAGE } from '../../constants/vehicle/usage'

// Here is FNI official document but archives are no more availables : https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=LEGITEXT000006075077&dateTexte=20091230#LEGISCTA000006160455
// Here si SIV official document and his many updates : https://www.legifrance.gouv.fr/affichTexteArticle.do;jsessionid=0359CC73BF1A1260FDBBE2ED7500C877.tplgfr22s_2?idArticle=LEGIARTI000020246004&cidTexte=JORFTEXT000020237165&categorieLien=id&dateTexte=20091231


const extractYear = (dateString, defaultYear) => {
	const [day, month, year] = dateString.split('/')
	return year ? year : defaultYear
}

export const isSubjectToTechnicalControl = ({ genre, carrosserieNat, ptac, dateMiseEnService, usages=[] }) => {
	// If no dateMiseEnService, correlated condition must always returns true to ask UTAC
	const defaultYear = new Date().getFullYear() + 1
	const anneeMiseEnService = extractYear(dateMiseEnService, defaultYear)
	if (
		// Quadricycle à moteur <=> Voiture sans permis
		genre === GENRE.QM ||

		// Moto (2 et 3 roues)
		[
			GENRE.MTL,
			GENRE.MTT1,
			GENRE.MTT2,
			GENRE.CL,
			GENRE.CYCL,
			GENRE.TM
		].includes(genre) ||

		// Caravane
		genre === GENRE.VASP && carrosserieNat === CARROSSERIE_NAT.CARAVANE && ptac > 500 && ptac <= 3500 ||

		// Remorque
		genre === GENRE.REM && carrosserieNat !== CARROSSERIE_NAT.CARAVANE && ptac > 500 && ptac <= 3500 ||

		// Tracteur agricoles
		[
			GENRE.MAGA,
			GENRE.TRA
		].includes(genre) ||

		// Véhicule de collection
		// @todo : which date comparison util to use?
		usages.includes(USAGE.COL) && anneeMiseEnService < 1960 && ptac <= 3500 ||
		usages.includes(USAGE.COL) && ptac > 3500
	) {
		return false
	}

	// If there is some doubt, return true since UTAC api
	// will returns empty response if there is no available technical control.

	/* All <true> known cases:
		genre === GENRE.VP ||
		genre === GENRE.CTTE ||  // non TCP

		// Caravane
		genre === GENRE.VASP && carrosserieNat === CARROSSERIE_NAT.CARAVANE ||

		// vehicule de collection PTAC <= 3,5T ET mis en circulation à partir de 1960
		// @todo : which date comparison util to use?
		usages.includes(USAGE.COL) && anneeMiseEnService >= 1960 && ptac <= 3500 ||

		// Poids lourd
		[
			GENRE.TRR,
			GENRE.CAM,
			// All REM except personal REM
			GENRE.REM && carrosserieNat !== CARROSSERIE_NAT.CARAVANE,
			GENRE.RETC,
			GENRE.RESP,
			GENRE.SRAT,
			GENRE.SREM,
			GENRE.SRTC,
			GENRE.SRSP,
			GENRE.VASP,
			GENRE.TCP,
		].includes(genre) ||

		// Transport de marchandises dangereuses avec certificat d'agrément
		// Unknown spec ||

		// M1 poids lourd
		categorie === CATEGORIE.M1 && carrosserieNat !== CARROSSERIE_NAT.AMBULANC && ptac > 3500
	*/
	return true
}
