<template>
  <LineChart
    :chart-data="lineData"
    :chart-options="chartOptions"
    role="img"
    :aria-label="ariaLabel"
  />
</template>

<script>

import orderBy from 'lodash.orderby'
import {formatIsoToFrDate} from '@Assets/js/format.js'
import {transformeDateFrEnISO} from '@Utils/format/date';

import {Line as LineChart} from 'vue-chartjs'
import {Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip} from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, TimeScale, LinearScale)


export default {
  name: 'ControlesTechniquesLineChart',

  components: { LineChart },

  props: {
    controlesTechniques: {
      type: Array,
      default: () => [],
    },
    ariaLabel: {
      type: String,
      default: '',
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
    chartOptions () {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            axis: 'x',
            type: 'time',
            time: {
              unit: 'year',
            },
          },
          y: {
            axis: 'y',
            display: true,
            ticks: {
              beginAtZero: true,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItem) => {
                const day = formatIsoToFrDate(tooltipItem[0].raw.x)
                const km = Math.round(tooltipItem[0].raw.y * 100) / 100
                const kmLibelle = new Intl.NumberFormat().format(km)

                return `Le ${day}: ${kmLibelle} km`
              },
              label: (tooltipItem) => {
                const nature = this.nature[tooltipItem.dataIndex]
                const resultat = this.resultat[tooltipItem.dataIndex]

                return `${nature}: ${resultat}`
              },
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
              label: 'Kilométrage',
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

  methods: {
    controlToPoint (controle) {
      return {
          x: transformeDateFrEnISO(controle?.date),
          y: controle.km,
        }
      },
  },
}

</script>
