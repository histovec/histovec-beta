import { CARROSSERIE_NAT } from '../../constants/vehicle/carrosserieNat'
import { CATEGORIE } from '../../constants/vehicle/categorie'
import { GENRE } from '../../constants/vehicle/genre'

// Here is FNI official document but archives are no more availables : https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=LEGITEXT000006075077&dateTexte=20091230#LEGISCTA000006160455
// Here si SIV official document and his many updates : https://www.legifrance.gouv.fr/affichTexteArticle.do;jsessionid=0359CC73BF1A1260FDBBE2ED7500C877.tplgfr22s_2?idArticle=LEGIARTI000020246004&cidTexte=JORFTEXT000020237165&categorieLien=id&dateTexte=20091231


export const isTracteurAgricole = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.TRA && (
			// added on 2009-04-14
			[
				CATEGORIE.T1,
				CATEGORIE.T2,
				CATEGORIE.T3,
				CATEGORIE.T4,

				// added on 2016-06-12
				CATEGORIE.T1a,
				CATEGORIE.T1b,
				CATEGORIE.T2a,
				CATEGORIE.T2b,
				CATEGORIE.T3a,
				CATEGORIE.T3b,
				CATEGORIE['T4.1a'],
				CATEGORIE['T4.1b'],
				CATEGORIE['T4.2a'],
				CATEGORIE['T4.2b'],
				CATEGORIE['T4.3a'],
				CATEGORIE['T4.3b'],
				CATEGORIE.C1a,
				CATEGORIE.C1b,
				CATEGORIE.C2a,
				CATEGORIE.C2b,
				CATEGORIE.C3a,
				CATEGORIE.C3b,
				CATEGORIE['C4.1a'],
				CATEGORIE['C4.1b'],
				CATEGORIE['C4.2a'],
				CATEGORIE['C4.2b'],
				CATEGORIE['C4.3a'],
				CATEGORIE['C4.3b'],

			].includes(categorie) && [
				CARROSSERIE_NAT.AGRICOLE,
				CARROSSERIE_NAT.FOREST,
				CARROSSERIE_NAT.NON_SPEC
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

export const isRemorqueAgricole = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.REA && (
			// added on 2009-04-14
			[
				CATEGORIE.R1,
				CATEGORIE.R2,
				CATEGORIE.R3,
				CATEGORIE.R4,

				// added on 2016-06-12
				CATEGORIE.R1a,
				CATEGORIE.R1b,
				CATEGORIE.R2a,
				CATEGORIE.R2b,
				CATEGORIE.R3a,
				CATEGORIE.R3b,
				CATEGORIE.R4a,
				CATEGORIE.R4b
			].includes(categorie) && [
				CARROSSERIE_NAT.BEN_AMO,
				CARROSSERIE_NAT.BENNE,
				CARROSSERIE_NAT.BEN_CERE,
				CARROSSERIE_NAT.BETAIL,
				CARROSSERIE_NAT.CASIERS,
				CARROSSERIE_NAT.CIT_ALIM,
				CARROSSERIE_NAT.CIT_ALTD,
				CARROSSERIE_NAT.CIT_BETA,
				CARROSSERIE_NAT.CIT_GAZ,
				CARROSSERIE_NAT.CARB_LEG,
				CARROSSERIE_NAT.CARB_LRD,
				CARROSSERIE_NAT.CIT_VID,
				CARROSSERIE_NAT.CIT_EAU,
				CARROSSERIE_NAT.CIT_PULV,
				CARROSSERIE_NAT.BACHE,
				CARROSSERIE_NAT.FOURGON,
				CARROSSERIE_NAT.FG_TD,
				CARROSSERIE_NAT.BETON,
				CARROSSERIE_NAT.PLATEAU,
				CARROSSERIE_NAT.PTE_BAT,
				CARROSSERIE_NAT.PTE_FER,
				CARROSSERIE_NAT.PTE_VOIT,
				CARROSSERIE_NAT.SAVOYARD,
				CARROSSERIE_NAT.PLSC,
				CARROSSERIE_NAT.NON_SPEC,
				CARROSSERIE_NAT.CHAS_CAB,
				CARROSSERIE_NAT.PTE_ENG,
				CARROSSERIE_NAT.PTE_CONT,
				CARROSSERIE_NAT.PTE_ENG,
				CARROSSERIE_NAT.PTE_CONT,
				CARROSSERIE_NAT.FOREST,
				CARROSSERIE_NAT.AV_TRAIN,
				CARROSSERIE_NAT.AR_TRAIN,
				CARROSSERIE_NAT.AR_FORES,
				CARROSSERIE_NAT.TB,

				// added on 2012-04-22
				CARROSSERIE_NAT.FOREST
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

export const isSemiRemorqueAgricole = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.SREA && (
			// added on 2009-04-14
			[
				CATEGORIE.S1,
				CATEGORIE.S2,

				// added on 2010-01-01
				CATEGORIE.R1,
				CATEGORIE.R2,
				CATEGORIE.R3,
				CATEGORIE.R4,

				// added on 2016-06-12
				CATEGORIE.R1a,
				CATEGORIE.R2a,
				CATEGORIE.R3a,
				CATEGORIE.R4a,

				// added on 2018-06-20
				CATEGORIE.R1b,
				CATEGORIE.R2b,
				CATEGORIE.R3b,
				CATEGORIE.R4b
			].includes(categorie) && [
				CARROSSERIE_NAT.BEN_AMO,
				CARROSSERIE_NAT.BENNE,
				CARROSSERIE_NAT.BEN_CERE,
				CARROSSERIE_NAT.BETAIL,
				CARROSSERIE_NAT.CASIERS,
				CARROSSERIE_NAT.CIT_ALIM,
				CARROSSERIE_NAT.CIT_ALTD,
				CARROSSERIE_NAT.CIT_BETA,
				CARROSSERIE_NAT.CIT_GAZ,
				CARROSSERIE_NAT.CARB_LEG,
				CARROSSERIE_NAT.CARB_LRD,
				CARROSSERIE_NAT.CIT_VID,
				CARROSSERIE_NAT.CIT_EAU,
				CARROSSERIE_NAT.CIT_PULV,
				CARROSSERIE_NAT.BACHE,
				CARROSSERIE_NAT.FOURGON,
				CARROSSERIE_NAT.FG_TD,
				CARROSSERIE_NAT.BETON,
				CARROSSERIE_NAT.PLATEAU,
				CARROSSERIE_NAT.PTE_BAT,
				CARROSSERIE_NAT.PTE_FER,
				CARROSSERIE_NAT.PTE_VOIT,
				CARROSSERIE_NAT.SAVOYARD,
				CARROSSERIE_NAT.PLSC,
				CARROSSERIE_NAT.NON_SPEC,
				CARROSSERIE_NAT.CHAS_CAB,
				CARROSSERIE_NAT.PTE_ENG,
				CARROSSERIE_NAT.PTE_CONT,
				CARROSSERIE_NAT.PTE_ENG,
				CARROSSERIE_NAT.PTE_CONT,
				CARROSSERIE_NAT.FOREST,
				CARROSSERIE_NAT.AV_TRAIN,
				CARROSSERIE_NAT.AR_TRAIN,
				CARROSSERIE_NAT.AR_FORES,
				CARROSSERIE_NAT.TB,

				// added on 2012-04-22
				CARROSSERIE_NAT.FOREST
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

export const isMachineAgricoleAutomotrice = (genre, categorie) => {
	if (
		genre === GENRE.MAGA && (
			// added on 2009-04-14
			!categorie && carroserieNat ===	CARROSSERIE_NAT.NON_SPEC
		)
	) {
		return true
	}

	return false
}

export const isMachineOuInstrumentRemorque = (genre, categorie, carroserieNat) => {
	if (
		genre === GENRE.MIAR && (
			// added on 2009-04-14
			(
				!categorie ||
				// added on 2010-01-01
				[
					CATEGORIE.S1,
					CATEGORIE.S2,

					// added on 2016-06-12
					CATEGORIE.S1a,
					CATEGORIE.S1b,
					CATEGORIE.S2a,
					CATEGORIE.S2b
				].includes(categorie)
			) && carroserieNat ===	CARROSSERIE_NAT.NON_SPEC
		)
	) {
		return true
	}

	return false
}
