export const booleanLabel = (test, { upperCase }={ upperCase: true }) => {
	const label = test ? 'Oui' : 'Non'
	return upperCase ? label.toUpperCase() : label
}

export const formatDate = (isoDate) => {
  let d = new Date(Date.parse(isoDate) + new Date().getTimezoneOffset() * 60 * 1000 + 120 * 60 * 1000 )
  return Intl.DateTimeFormat('fr-FR').format(d)
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
