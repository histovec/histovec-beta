import { FR_DATE_FORMAT } from '@Constants/date'
import { DATE_FR_REGEX } from '@Constants/regex'

export const transformeDateEnFr = (date) => {
  if(!date){
    return null
  }

  if (date.match(DATE_FR_REGEX)) return date

  return new Date(date).toLocaleDateString(FR_DATE_FORMAT)
}
