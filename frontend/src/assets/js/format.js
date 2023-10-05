import { MISSING_VALUE } from '@Assets/js/constants'

export const FR_DATE_FORMAT = 'fr-FR'

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

  return new Date(isoDate).toLocaleDateString(FR_DATE_FORMAT,
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

export const formatIsoToFrDate = (isoDate) => {
	if(!isoDate){
		return ''
	}

  return new Date(isoDate).toLocaleDateString(FR_DATE_FORMAT)
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
