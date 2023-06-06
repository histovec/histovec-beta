import { normalizeKeyAsDataPreparation } from '@Utils/dataPreparationFormat'
import genererId from './genererId'
import { base64Encode } from '@Utils/encoding'
import { hash } from '@Utils/crypto.js'

const cleProprietaire = async (formData) => {
  if (!formData) {
    return null
  }

  const normalizedKey = normalizeKeyAsDataPreparation(genererId.vehiculeId(formData))
  const hashedKeyBuffer = await hash(normalizedKey)
  return base64Encode(hashedKeyBuffer)
}

export default {
  cleProprietaire,
}
