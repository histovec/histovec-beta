export default {
  plaqueSiv (plaque) {
    return (
      plaque.toUpperCase()
        .replace(/^(([A-Z]{1,2})((-|\s+)?([0-9])(([0-9]{1,2})((-|\s+)?([A-Z]{1,2}))?)?)?)?.*$/, '$2-$5$7-$10')
        .replace(/-*$/, '')
    )
  },
  plaqueFni (plaque) {
    return (
      plaque.toUpperCase()
        .replace(/^(([0-9])(([0-9]{1,3})((-|\s)?(([A-Z])(([A-Z]{1,2})((-|\s)?(([0-9])([0-9aAbB][0-9]?)?))?)?)?)?)?)?.*$/, '$2$4 $8$10 $14$15' )
        .replace(/\s*$/, '')
    )
  },
  dateOrYear (date) {
    return (
      date.replace(/^(([0-3])((\d)(\/?([0-1])((\d)(\/?(([1-2])(\d{1,3})?))?)?)?)?)?.*$/, '$2$4/$6$8/$11$12')
      .replace(/\/{1,2}$/, '')
    )
  },
}