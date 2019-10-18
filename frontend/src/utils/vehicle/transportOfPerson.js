import { CARROSSERIE_NAT } from '../../constants/vehicle/carrosserieNat'
import { CATEGORIE } from '../../constants/vehicle/categorie'
import { GENRE } from '../../constants/vehicle/genre'

// Here is FNI official document but archives are no more availables : https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=LEGITEXT000006075077&dateTexte=20091230#LEGISCTA000006160455
// Here si SIV official document and his many updates : https://www.legifrance.gouv.fr/affichTexteArticle.do;jsessionid=0359CC73BF1A1260FDBBE2ED7500C877.tplgfr22s_2?idArticle=LEGIARTI000020246004&cidTexte=JORFTEXT000020237165&categorieLien=id&dateTexte=20091231


export const isMotocycletteLegere = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.MTL && (
			// added on 2009-04-14
			categorie === CATEGORIE.L3e && carrosserieNat === CARROSSERIE_NAT.SOLO ||
			categorie === CATEGORIE.L4e && [
				CARROSSERIE_NAT.SOLO_SIDE_CAR,
				CARROSSERIE_NAT.SIDE_CAR
			].includes(carrosserieNat) ||

			// added on 2016-06-12
			categorie === CATEGORIE['L3e-A1'] && carrosserieNat === CARROSSERIE_NAT.SOLO ||
			categorie === CATEGORIE['L3e-A1E'] && carrosserieNat === CARROSSERIE_NAT.ENDURO ||
			categorie === CATEGORIE['L3e-A1T'] && carrosserieNat === CARROSSERIE_NAT.TRIAL ||
			categorie === CATEGORIE['L4e-A1'] && [
				CARROSSERIE_NAT.SOLO_SIDE_CAR, CARROSSERIE_NAT.SIDE_CAR
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

// Motocyclettes autres que motocyclettes légères
// dont la puissance maximale nette CE ≤ 35 kW
// et dont la puissance maximale nette CE/ poids en ordre de marche ≤ 0,2 kW/ kg
export const isAutreMotocycletteLimitee = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.MTT1 && (
			// added on 2009-04-15
			categorie === CATEGORIE.L3e && carrosserieNat === CARROSSERIE_NAT.SOLO ||
			// @todo: ambiguous => https://www.legifrance.gouv.fr/affichTexteArticle.do;jsessionid=885958B3CCD44742CEA7B49B579A40F2.tplgfr22s_2?idArticle=LEGIARTI000021700297&cidTexte=JORFTEXT000020237165&categorieLien=id&dateTexte=20100620
			// categorie === CATEGORIE.L3e && carrosserieNat === CARROSSERIE_NAT.SOLO_SIDE_CAR ||
			// categorie === CATEGORIE.L3e && carrosserieNat === CARROSSERIE_NAT.SIDE_CAR

			// added on 2010-06-21
			categorie === CATEGORIE.L4e && [
				CARROSSERIE_NAT.SOLO_SIDE_CAR,
				CARROSSERIE_NAT.SIDE_CAR
			].includes(carrosserieNat) ||

			// added on 2016-06-12
			categorie === CATEGORIE['L3e-A2'] && carrosserieNat === CARROSSERIE_NAT.SOLO ||
			categorie === CATEGORIE['L3e-A2E'] && carrosserieNat === CARROSSERIE_NAT.ENDURO ||
			categorie === CATEGORIE['L3e-A2T'] && carrosserieNat === CARROSSERIE_NAT.TRIAL ||
			categorie === CATEGORIE['L4e-A2'] && [
				CARROSSERIE_NAT.SOLO_SIDE_CAR, CARROSSERIE_NAT.SIDE_CAR
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

export const isAutreMotocyclette = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.MTT2 && (
			// added on 2009-04-15
			categorie === CATEGORIE.L3e && carrosserieNat === CARROSSERIE_NAT.SOLO ||
			// ambiguous => https://www.legifrance.gouv.fr/affichTexteArticle.do;jsessionid=885958B3CCD44742CEA7B49B579A40F2.tplgfr22s_2?idArticle=LEGIARTI000021700297&cidTexte=JORFTEXT000020237165&categorieLien=id&dateTexte=20100620
			// categorie === CATEGORIE.L3e && carrosserieNat === CARROSSERIE_NAT.SOLO_SIDE_CAR ||
			// categorie === CATEGORIE.L3e && carrosserieNat === CARROSSERIE_NAT.SIDE_CAR

			// added on 2010-06-21
			categorie === CATEGORIE.L4e && [
				CARROSSERIE_NAT.SOLO_SIDE_CAR,
				CARROSSERIE_NAT.SIDE_CAR
			].includes(carrosserieNat) ||

			// added on 2016-06-12
			categorie === CATEGORIE['L3e-A3'] && carrosserieNat === CARROSSERIE_NAT.SOLO ||
			categorie === CATEGORIE['L3e-A3E'] && carrosserieNat === CARROSSERIE_NAT.ENDURO ||
			categorie === CATEGORIE['L3e-A3T'] && carrosserieNat === CARROSSERIE_NAT.TRIAL ||
			categorie === CATEGORIE['L4e-A3'] && [
				CARROSSERIE_NAT.SOLO_SIDE_CAR, CARROSSERIE_NAT.SIDE_CAR
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

export const isTricycleAMoteur = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.TM && (
			// added on 2009-04-15
			categorie === CATEGORIE.L5e && [
				CARROSSERIE_NAT.TMP1,
				CARROSSERIE_NAT.TMP2
			].includes(carrosserieNat) ||

			// added on 2016-06-12
			categorie === CATEGORIE['L5e-A'] && [
				CARROSSERIE_NAT.TMP1,
				CARROSSERIE_NAT.TMP2
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

export const isQuadricycleAMoteur = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.QM && (
			// added on 2009-04-15
			categorie === CATEGORIE.L6e && carrosserieNat === CARROSSERIE_NAT.QLEM ||
			categorie === CATEGORIE.L7e && [
				CARROSSERIE_NAT.QLOMP,
				CARROSSERIE_NAT.QLOM_P
			].includes(carrosserieNat) ||

			// added on 2016-06-12
			categorie === CATEGORIE['L6e-A'] && carrosserieNat === CARROSSERIE_NAT.QUAD ||
			categorie === CATEGORIE['L6e-BP'] && carrosserieNat === CARROSSERIE_NAT.QLEMP ||
			categorie === CATEGORIE['L7e-A1'] && carrosserieNat === CARROSSERIE_NAT.QUADLP1 ||
			categorie === CATEGORIE['L7e-A2'] && carrosserieNat === CARROSSERIE_NAT.QUADLP2 ||
			categorie === CATEGORIE['L7e-B1'] && carrosserieNat === CARROSSERIE_NAT.QUADHR ||
			categorie === CATEGORIE['L7e-B2'] && carrosserieNat === CARROSSERIE_NAT.BUGGY ||
			categorie === CATEGORIE['L7e-CP'] && [
				CARROSSERIE_NAT.QLOMP,
				CARROSSERIE_NAT.QLOM_P
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

export const isCyclomoteurATroisRoues = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.CYCL && (
			// added on 2009-04-15
			[
				CATEGORIE.L2e,

				// added on 2016-06-12
				CATEGORIE['L2e-P']
			].includes(categorie) &&
			carrosserieNat === CARROSSERIE_NAT.VTTE
		)
	) {
		return true
	}

	return false
}

export const isCyclomoteurADeuxRouesOuNonCarrosseATroisRoues = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.CL && (
			// added on 2009-04-15
			categorie === CATEGORIE.L1e && [
				CARROSSERIE_NAT.SOLO,
				CARROSSERIE_NAT.SOLO_SIDE_CAR,
				CARROSSERIE_NAT.SIDE_CAR
			].includes(carrosserieNat) ||
			categorie === CATEGORIE.L2e && carrosserieNat === CARROSSERIE_NAT.CLTRP ||

			// added on 2016-06-12
			categorie === CATEGORIE['L1e-A'] && carrosserieNat === CARROSSERIE_NAT.SOLO ||
			categorie === CATEGORIE['L1e-B'] && carrosserieNat === CARROSSERIE_NAT.SOLO ||
			categorie === CATEGORIE['L2e-P'] && carrosserieNat === CARROSSERIE_NAT.CLTRP
		)
	) {
		return true
	}

	return false
}

export const isVoitureParticuliere = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.VP && (
			// added on 2009-04-15
			[
				CATEGORIE.M1,

				// added on 2016-06-12
				CATEGORIE.M1G
			].includes(categorie) && [
				CARROSSERIE_NAT.CI,
				CARROSSERIE_NAT.CABR,
				CARROSSERIE_NAT.BREAK,
				CARROSSERIE_NAT.CIALE,
				CARROSSERIE_NAT.HANDICAP,
				CARROSSERIE_NAT.NON_SPEC
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

export const isTransportEnCommunDePersonnes = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.TCP && (
			// added on 2009-04-15
			categorie === CATEGORIE.M2 && carrosserieNat === CARROSSERIE_NAT.BUS ||
			categorie === CATEGORIE.M3 && [
				CARROSSERIE_NAT.CAR,
				CARROSSERIE_NAT.HANDICAP,
				CARROSSERIE_NAT.NON_SPEC
			].includes(carrosserieNat) ||

			// added on 2016-06-12
			categorie === CATEGORIE.M2 &&	[
				CARROSSERIE_NAT.CAR,
				CARROSSERIE_NAT.HANDICAP,
				CARROSSERIE_NAT.NON_SPEC
			].includes(carrosserieNat) ||
			categorie === CATEGORIE.M3 && carrosserieNat === CARROSSERIE_NAT.BUS ||
			categorie === CATEGORIE.M3G && [
				CARROSSERIE_NAT.BUS,
				CARROSSERIE_NAT.CAR,
				CARROSSERIE_NAT.HANDICAP,
				CARROSSERIE_NAT.NON_SPEC
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

export const isVehiculeAutomoteurSpecialise = (genre, categorie, carrosserieNat) => {
	// added on 2018-12-16
	if (
		genre === GENRE.VASP && (
			!categorie && carrosserieNat === CARROSSERIE_NAT.NAVURB
		)
	) {
		return true
	}

	return false
}

export const isRemorqueSpecialisee = (genre, categorie, carrosserieNat) => {
	// added on 2018-12-16
	if (
		genre === GENRE.RESP && (
			categorie === CATEGORIE['02'] && carrosserieNat === CARROSSERIE_NAT.REMURB
		)
	) {
		return true
	}

	return false
}
