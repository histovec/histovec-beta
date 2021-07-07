import { UTACClient } from '../services/utac.js'

const utacClient = new UTACClient()

export const getUtacClient = () => {
  return utacClient
}
