import { MISSING_VALUE } from './constants'

export const FR_DATE_FORMAT = 'DD/MM/YYYY'
export const ISO_DATE_FORMAT = 'YYYY-MM-DD'

export const booleanLabel = (test, { upperCase }={ upperCase: true }) => {
	const label = test ? 'Oui' : 'Non'
	return upperCase ? label.toUpperCase() : label
}

export const formatIsoToFrDate = (isoDate) => {
	if(!isoDate){
		return ''
	}

	const date = new Date(Date.parse(isoDate) + new Date().getTimezoneOffset() * 60 * 1000 + 120 * 60 * 1000 )
	return Intl.DateTimeFormat('fr-FR').format(date)
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
