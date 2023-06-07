import add from 'date-fns/add';
import format from 'date-fns/format';

export const getTomorrowTime = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return new Date(tomorrow.toDateString()).getTime()
}

export const getTodayTime = () => {
  const today = new Date()
  return new Date(today.toDateString()).getTime()
}

export const getAnneeEtMois = (decalageMois) => {
  let date = add(new Date(),  {days: -7})

  if (decalageMois) {
    date = add(date, {months: -decalageMois})
  }
  return format(date, 'yyyyMM')
}
