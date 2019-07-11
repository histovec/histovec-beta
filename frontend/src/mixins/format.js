export const formatMixin = {
  methods: {
		getExposant: function (nb) {
      if (nb === 1) {
        return 'er'
      }
      if (nb === 2) {
        return 'nd'
      }
      return 'e'
    }
  }
}
