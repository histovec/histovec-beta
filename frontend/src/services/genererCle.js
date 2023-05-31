import { normalizeKeyAsDataPreparation } from '../utils/dataPreparationFormat'
import genererId from './genererId'
import { base64Encode } from '@Utils/encoding'
import { hash } from '@Utils/crypto.js'

const cleProptietaire = async (formData) => {
  if (!formData) {
    return null
  }

  const normalizedKey = normalizeKeyAsDataPreparation(genererId.vehiculeId(formData))
  const hashedKeyBuffer = await hash(normalizedKey)
  return base64Encode(hashedKeyBuffer)
}

export default {
  cleProptietaire,
}
