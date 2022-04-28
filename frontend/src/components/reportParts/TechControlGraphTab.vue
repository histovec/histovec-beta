<script>

import orderBy from 'lodash.orderby'
import { Line } from 'vue-chartjs'

import { formatIsoToFrDate } from '../../assets/js/format.js'

export default {
  extends: Line,
  props: {
    controlesTechniques: {
      type: Array,
      default: () => [],
    },
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
        X: 'DarkGrey',
      },
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
              unit: 'year',
            },
          }],
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true,
            },
          }],
        },
        tooltips: {
          callbacks: {
            title: (tooltipItem) => {
              const day = formatIsoToFrDate(tooltipItem[0].xLabel)
              const km = Math.round(tooltipItem[0].yLabel * 100) / 100
              const kmLibelle = new Intl.NumberFormat().format(km)

              return `Le ${day}: ${kmLibelle} km`
            },
            label: (tooltipItem) => {
              const nature = this.nature[tooltipItem.index]
              const resultat = this.resultat[tooltipItem.index]

              return `${nature}: ${resultat}`
            },
          },
        },
      }
    },
    data () {
      return orderBy(this.controlesTechniques.map((controle) => this.controlToPoint(controle)), ['x'], ['asc'])
    },
    pointColors () {
      return orderBy(this.controlesTechniques.map((controle) => this.colors[controle.resultat]), ['x'], ['asc'])
    },
    nature () {
      return orderBy(this.controlesTechniques.map((controle) => controle.natureLibelle), ['x'], ['asc'])
    },
    resultat () {
      return orderBy(this.controlesTechniques.map((controle) => controle.resultatLibelle), ['x'], ['asc'])
    },
    lineData () {
      if (this.controlesTechniques.length > 0) {
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
            },
          ],
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
        x: controle.date,
        y: controle.km,
      }

      return point
    },
  },
}

</script>
