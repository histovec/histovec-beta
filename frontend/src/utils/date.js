export const getTomorrowTime = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return new Date(tomorrow.toDateString()).getTime()
}

export const getTodayTime = () => {
  const today = new Date()
  return new Date(today.toDateString()).getTime()
}
