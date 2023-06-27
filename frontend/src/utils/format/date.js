import { FR_DATE_FORMAT } from '@Constants/date'
import { DATE_FR_REGEX, DATE_ISO_REGEX } from '@Constants/regex'

export const transformeDateEnFr = (date) => {
  if(!date){
    return null
  }

  if (date.match(DATE_FR_REGEX)) return date

  return new Date(date).toLocaleDateString(FR_DATE_FORMAT)
}

export const transformeDateFrEnISO = (date) => {
  if(!date) {
    return null
  }

  if( date.match(DATE_ISO_REGEX)) return date

  const dateSplite = date.split('/')
  return `${dateSplite[2]}-${dateSplite[1]}-${dateSplite[0]}`
}
