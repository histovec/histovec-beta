import { CARROSSERIE_NAT } from '../../constants/vehicle/carrosserieNat'
import { CATEGORIE } from '../../constants/vehicle/categorie'
import { GENRE } from '../../constants/vehicle/genre'

// Here is FNI official document but archives are no more availables : https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=LEGITEXT000006075077&dateTexte=20091230#LEGISCTA000006160455
// Here si SIV official document and his many updates : https://www.legifrance.gouv.fr/affichTexteArticle.do;jsessionid=0359CC73BF1A1260FDBBE2ED7500C877.tplgfr22s_2?idArticle=LEGIARTI000020246004&cidTexte=JORFTEXT000020237165&categorieLien=id&dateTexte=20091231


const getIsRemorqueSpecialiseeOrSemiRemorqueSpecialiseeHelper = (definedGenre) => {
	return (genre, categorie, carrosserieNat) => {
		if (
			genre === definedGenre && (
				// added on 2009-04-15
				[
					CATEGORIE['01'],
					CATEGORIE['02'],
					CATEGORIE['03'],
					CATEGORIE['04']
				].includes(categorie) && [
					CARROSSERIE_NAT.AMBULANC, // AMBULAN value has been migrated to AMBULANC
					CARROSSERIE_NAT.ATELIER,
					CARROSSERIE_NAT.BAZ_FOR,
					CARROSSERIE_NAT.BOM,
					CARROSSERIE_NAT.CARAVANE,
					CARROSSERIE_NAT.CHAR_POR,
					CARROSSERIE_NAT.DEPANNAG,
					CARROSSERIE_NAT.FG_BLIND,
					CARROSSERIE_NAT.FG_FUNER,
					CARROSSERIE_NAT.GRUE,
					CARROSSERIE_NAT.HANDICAP,
					CARROSSERIE_NAT.INCENDIE,
					CARROSSERIE_NAT.MAGASIN,
					CARROSSERIE_NAT.SANITAIR,
					CARROSSERIE_NAT.TRAVAUX,
					CARROSSERIE_NAT.VOIRIE,
					CARROSSERIE_NAT.NON_SPEC

				].includes(carrosserieNat)
			)
		) {
			return true
		}

		return false
	}
}

export const isVehiculeAutomoteurSpecialise = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.VASP && (
			// added on 2009-04-15
			categorie === CATEGORIE.M1 && [
				CARROSSERIE_NAT.AMBULANC, // AMBULAN value has been migrated to AMBULANC
				CARROSSERIE_NAT.CARAVANE,
				CARROSSERIE_NAT.FG_FUNER,

				// added on 2015-03-01
				CARROSSERIE_NAT.DERIV_VP
			].includes(carrosserieNat) ||
			[
				CATEGORIE.N1,
				CATEGORIE.N2,
				CATEGORIE.N3
			].includes(categorie) && [
				CARROSSERIE_NAT.ATELIER,
				CARROSSERIE_NAT.BAZ_FOR,
				CARROSSERIE_NAT.BOM,
				CARROSSERIE_NAT.CHAR_POR,
				CARROSSERIE_NAT.DEPANNAG,
				CARROSSERIE_NAT.FG_BLIND,
				CARROSSERIE_NAT.GRUE,
				CARROSSERIE_NAT.INCENDIE,
				CARROSSERIE_NAT.MAGASIN,
				CARROSSERIE_NAT.TRAVAUX,
				CARROSSERIE_NAT.VOIRIE
			].includes(carrosserieNat) ||
			[
				CATEGORIE.M1,
				CATEGORIE.N1
			].includes(categorie) && carrosserieNat === CARROSSERIE_NAT.HANDICAP ||
			[
				CATEGORIE.M1,
				CATEGORIE.N1,
				CATEGORIE.N2,
				CATEGORIE.N3
			].includes(categorie) && [
				CARROSSERIE_NAT.SANITAIR,
				CARROSSERIE_NAT.NON_SPEC
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

export const isSemiRemorqueSpecialisee = (genre, categorie, carrosserieNat) => {
	return getIsRemorqueSpecialiseeOrSemiRemorqueSpecialiseeHelper(GENRE.SRSP)(genre, categorie, carrosserieNat)
}

export const isRemorqueSpecialisee = (genre, categorie, carrosserieNat) => {
	return getIsRemorqueSpecialiseeOrSemiRemorqueSpecialiseeHelper(GENRE.RESP)(genre, categorie, carrosserieNat)
}
