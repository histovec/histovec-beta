import { CARROSSERIE_NAT } from '../../constants/vehicle/carrosserieNat'
import { CATEGORIE } from '../../constants/vehicle/categorie'
import { GENRE } from '../../constants/vehicle/genre'

// Here is FNI official document but archives are no more availables : https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=LEGITEXT000006075077&dateTexte=20091230#LEGISCTA000006160455
// Here si SIV official document and his many updates : https://www.legifrance.gouv.fr/affichTexteArticle.do;jsessionid=0359CC73BF1A1260FDBBE2ED7500C877.tplgfr22s_2?idArticle=LEGIARTI000020246004&cidTexte=JORFTEXT000020237165&categorieLien=id&dateTexte=20091231


const getIsRemorqueOrSemiRemorqueHorsSRATHelper = (definedGenre) => {
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
}

export const isTricycleAMoteur = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.TM && (
			// added on 2009-04-15
			[
				CATEGORIE.L5e,

				// added on 2016-06-12
				CATEGORIE['L5e-B']
			].includes(categorie) && [
				CARROSSERIE_NAT.TMM1,
				CARROSSERIE_NAT.TMM2
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
			categorie === CATEGORIE.L7e &&
			[
				CARROSSERIE_NAT.QLOMM,
				CARROSSERIE_NAT.QLOM_M
			].includes(carrosserieNat) ||

			// added on 2016-06-12
			categorie === CATEGORIE['L6e-BU'] && carrosserieNat === CARROSSERIE_NAT.QLEMM ||
			categorie === CATEGORIE['L7e-CU'] &&
			[
				CARROSSERIE_NAT.QLOMM,
				CARROSSERIE_NAT.QLOM_M
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
			categorie === CATEGORIE.L2e && carrosserieNat === CARROSSERIE_NAT.CYCLM ||

			// added on 2016-06-12
			categorie === CATEGORIE['L2e-U'] &&
			[
				CARROSSERIE_NAT.CYCLM,
				CARROSSERIE_NAT.CLTRM
			].includes(carrosserieNat)
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
			categorie === CATEGORIE.L2e && carrosserieNat === CARROSSERIE_NAT.CLTRM ||

			// added on 2016-06-12
			categorie === CATEGORIE['L2e-U'] &&
			[
				CARROSSERIE_NAT.CYCLM,
				CARROSSERIE_NAT.CLTRM
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

export const isTracteurRoutier = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.TRR && (
			// added on 2009-04-15
			[
				CATEGORIE.N1,
				CATEGORIE.N2,
				CATEGORIE.N3,

				// added on 2016-06-12
				CATEGORIE.N3G
			].includes(categorie) &&
			[
				CARROSSERIE_NAT.FOREST,
				CARROSSERIE_NAT.PR_REM,
				CARROSSERIE_NAT.PR_SREM,
				CARROSSERIE_NAT.NON_SPEC
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

// Camionnettes (véhicules d'un poids total autorisé en charge inférieur ou égal à 3 500 kg autres que les tracteurs routiers).
export const isCamionnetteLimitee = (genre, categorie) => {
	// 2009-04-15 to 2016-06-11
	if (
		genre === GENRE.CTTE && (
			// added on 2009-04-15
			[
				CATEGORIE.N1,

				// added on 2016-06-12
				CATEGORIE.N1G
			].includes(categorie) && [
				CARROSSERIE_NAT.BEN_AMO,
				CARROSSERIE_NAT.BENNE,
				CARROSSERIE_NAT.BEN_CERE,
				CARROSSERIE_NAT.BETAIL,
				CARROSSERIE_NAT.CASIERS,
				CARROSSERIE_NAT.CIT_ALIM,
				CARROSSERIE_NAT.CIT_ALTD,
				CARROSSERIE_NAT.CIT_BETA,
				CARROSSERIE_NAT.CIT_CHIM,
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
				CARROSSERIE_NAT.CHAS_CAB
			].includes(categorie)
		)
	) {
		return true
	}

	return false
}

// Camions (véhicules d'un poids total autorisé en charge excédant 3 500 kg autres que les tracteurs routiers).
export const isCamion = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.CAM && (
			// added on 2009-04-15
			[
				CATEGORIE.N2,
				CATEGORIE.N3,

				// added on 2016-06-12
				CATEGORIE.N3G
			].includes(categorie) &&
			[
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

				// added on 2012-04-22
				CARROSSERIE_NAT.FOREST
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

export const isSemiRemorqueAvantTrain = (genre, categorie, carrosserieNat) => {
	if (
		genre === GENRE.SRAT && (
			// added on 2009-04-15
			[
				CATEGORIE['01'],
				CATEGORIE['02'],
				CATEGORIE['03'],
				CATEGORIE['04']
			].includes(categorie) &&
			[
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

				// added on 2012-04-22
				CARROSSERIE_NAT.FOREST
			].includes(carrosserieNat)
		)
	) {
		return true
	}

	return false
}

export const isSemiRemorqueRoutiere = (genre, categorie, carrosserieNat) => {
	return getIsRemorqueOrSemiRemorqueHorsSRATHelper(GENRE.SREM)(genre, categorie, carrosserieNat)
}

export const isRemorqueRoutiere = (genre, categorie, carrosserieNat) => {
	return getIsRemorqueOrSemiRemorqueHorsSRATHelper(GENRE.REM)(genre, categorie, carrosserieNat)
}

export const isSemiRemorquePourTransportsCombines = (genre, categorie, carrosserieNat) => {
	return getIsRemorqueOrSemiRemorqueHorsSRATHelper(GENRE.SRTC)(genre, categorie, carrosserieNat)
}

export const isRemorquePourTransportsCombines = (genre, categorie, carrosserieNat) => {
	return getIsRemorqueOrSemiRemorqueHorsSRATHelper(GENRE.RETC)(genre, categorie, carrosserieNat)
}
