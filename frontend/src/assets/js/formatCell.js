import {diffChars} from 'diff'
import moment from 'moment'

export default {coloredDiff, brDiff, formatSex, formatDiff, formatDistance, formatNumber, formatUndefined, formatRank, formatDate}

// CUSTOM FUNCTION
function formatDiff (strArray) {
  return coloredDiff(strArray.map(array2str))
}

// CUSTOM FUNCTION
function formatSex (doubleArray) {
  return coloredDiff(doubleArray.map(sexConvertor))
}

// CUSTOM FUNCTION
function sexConvertor (value) {
  if (value === '1' || value === 1) return 'H'
  if (value === '2' || value === 2) return 'F'

  return 'X'
}

// CUSTOM FUNCTION
function formatDistance (value) {
  if (value === '' || value === undefined) return '<span class="icon is-medium"><i class="fa fa-lg fa-question has-text-danger"></i></span>'

  if (value === 0) return '<span class="icon is-medium"><i class="fa fa-check has-text-dark"></i></span>'

  if (value < 10) return value + ' km'

  return Math.round(value) + ' km'
}

// CUSTOM FUNCTION
function formatRank (value) {
  return Number(value) === 1 ? '' : '<span class="icon"><i class="fa fa-exclamation-triangle has-text-danger"></i></span>'
}

// CUSTOM FUNCTION
function formatDate (doubleArray) {
  return coloredDiff(doubleArray.map((i) => moment(i, 'YYYY-MM-DD').format('DD/MM/YYYY')))
}

// BASE FUNCTION
function array2str (strArray) {
  if (typeof strArray === undefined) return ''

  if (strArray instanceof Array) return strArray.filter((n) => (n !== '' && n !== undefined)).join(' ')

  return strArray
}

// BASE FUNCTION
function formatNumber (value) {
  return (value === undefined) ? '' : String(value)
}

function formatUndefined (value) {
  return '<span class="has-text-grey-light">NA</span>'
}

// BASE FUNCTION
function coloredDiff (doubleArray) {
  if (doubleArray.length !== 2) return 'Error => array\'s length must be 2'

  if (doubleArray[0] === doubleArray[1]) return doubleArray[0]

  let diff = diffChars(doubleArray[0], doubleArray[1])
  let right = ''
  let left = ''

  diff.forEach(function (part) {
    if (part.added) {
      left += '<strong class="has-text-info">' + part.value + '</strong>'
    } else if (part.removed) {
      right += '<strong class="has-text-danger">' + part.value + '</strong>'
    } else {
      left += part.value
      right += part.value
    }
  })

  return brDiff([left, right])
}

// BASE FUNCTION
function brDiff (doubleArray) {
  if (doubleArray.length !== 2) return 'Error => array\'s length must be 2'

  return doubleArray[0] + '<br/>' + doubleArray[1]
}
