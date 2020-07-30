<script>

import orderBy from 'lodash.orderby'
import { Line } from 'vue-chartjs'
import dayjs from 'dayjs'

export default {
  extends: Line,
  props: {
    ct: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      colors: {
        A: 'DarkSeaGreen',
        AP: 'DarkSeaGreen',
        S: 'DarkOrange',
        SP: 'DarkOrange',
        R: 'OrangeRed',
        RP: 'OrangeRed',
        X: 'DarkGrey'
      }
    }
  },
  computed: {
    options () {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'year'
            }
          }],
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true
            }
          }]
        },
        tooltips: {
          callbacks: {
            title: (tooltipItem) => {
              const day = dayjs(tooltipItem[0].xLabel).format('DD/MM/YYYY')
              const km = Math.round(tooltipItem[0].yLabel * 100) / 100
              const formattedKm = new Intl.NumberFormat().format(km)

              return `Le ${day}: ${formattedKm} km`
            },
            label: (tooltipItem) => {
              const nature = this.nature[tooltipItem.index]
              const resultat = this.resultat[tooltipItem.index]

              return `${nature}: ${resultat}`
            }
          }
        }
      }
    },
    data () {
      return orderBy(this.ct.map((controle) => this.controlToPoint(controle)), ['x'], ['asc'])
    },
    pointColors () {
      return orderBy(this.ct.map((controle) => this.colors[controle.resultat]), ['x'], ['asc'])
    },
    nature () {
      return orderBy(this.ct.map((controle) => controle.natureLabel), ['x'], ['asc'])
    },
    resultat () {
      return orderBy(this.ct.map((controle) => controle.resultatLabel), ['x'], ['asc'])
    },
    lineData () {
      if (this.ct.length > 0) {
        return {
          datasets: [
            {
              label: 'kilomètres',
              data: this.data,
              pointBackgroundColor: this.pointColors,
              pointBorderColor: this.pointColors,
              pointHoverBackgroundColor: this.pointColors,
              pointHoverBorderColor: this.pointColors,
              pointRadius: 5,
              pointHoverRadius: 10,
            }
          ]
        }
      } else {
        return []
      }
    },
  },
  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/kilometers`)

    this.renderChart(this.lineData, this.options)
  },
  methods: {
    controlToPoint (controle) {
      const point = {
        x: controle.isoFormatDate,
        y: controle.km,
      }

      return point
    }
  }
}

</script>
