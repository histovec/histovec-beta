import { MISSING_VALUE } from '@/assets/js/constants'

import dayjs from 'dayjs'


export const FR_DATE_FORMAT = 'DD/MM/YYYY'
export const ISO_DATE_FORMAT = 'YYYY-MM-DD'

export const booleanLabel = (
	test,
	{ upperCase }={ upperCase: true },
	{ unknownValue } = { unknownValue: MISSING_VALUE },
) => {
	if (test === undefined) {
		return unknownValue
	}

	if (upperCase) {
		return test ? 'OUI' : 'NON'
	}

	return test ? 'Oui' : 'Non'
}

export const formatIsoToHumanReadableFrDate = (isoDate) => {
	if(!isoDate){
		return ''
	}

  // @todo @replaceDayjs : supprimer les usages de dayjs et les remplacer par du natif ou du date-fns
  // chart-js a besoin d'un bridge vers un outil de date pour faire fonctionner notre graphique
  // il n'existe aucun bridge pour dayjs.
  // j'ai choisi date-fns pour le bridge chart.js.
  // Si ça répond à tous nos usages, remplacer dayjs par date-fns partout (ou utiliser des Date JS natives)
	const humanReadableFrDate = dayjs(isoDate, ISO_DATE_FORMAT).toDate().toLocaleDateString(
		'fr-FR',
		{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
	)

	return humanReadableFrDate
}

export const formatIsoToFrDate = (isoDate) => {
	if(!isoDate){
		return ''
	}

  return new Date(isoDate).toLocaleDateString('fr-FR')
}

export const formatIsoToFrDateOrDefault = (isoDate, defaultValue=MISSING_VALUE) => {
	return isoDate ? formatIsoToFrDate(isoDate) : defaultValue
}

export const padString = (n, width, padChar='0') => {
	const stringifiedN = String(n)
	if (stringifiedN.length >= width) {
		return stringifiedN
	}

	const padding = new Array(width - stringifiedN.length + 1).join(padChar)
	return  `${padding}${stringifiedN}`
}

export const camelize = (str) => str.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase())
