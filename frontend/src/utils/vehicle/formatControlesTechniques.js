import icons from '@Assets/json/controlesTechniquesIcons.json'


const labelize = (controleTechnique) => {
	const { date, km, nature, natureLibelle, resultat, resultatLibelle } = controleTechnique

	const iconNature = icons.nature[nature]
	const iconResultat = icons.resultat[resultat]

	return {
		date,
		nature,
		natureLibelle,
		natureIcon: [iconNature.icon, iconNature.color, iconNature.size],
		resultat,
		resultatIcon: [iconResultat.icon, iconResultat.color, iconResultat.size],
		resultatLibelle,
		km,
		kmLibelle: new Intl.NumberFormat().format(km),
	}
}

export const labelizeControlesTechniques = (controlesTechniques=[]) => {
	const { historique } = controlesTechniques

	const labelizedHistorique = historique.map((controleTechnique) => labelize(controleTechnique))

	return {
		...controlesTechniques,
		historique: labelizedHistorique,
	}
}
