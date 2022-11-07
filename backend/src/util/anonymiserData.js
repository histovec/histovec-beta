export const anonymize = (text, nbVisibleCharAtPrefixAndSuffix = 2) => {
  const anonymizedText = '*'.repeat(text.length - nbVisibleCharAtPrefixAndSuffix * 2)
  return text.substr(0, nbVisibleCharAtPrefixAndSuffix) + anonymizedText + text.substr(nbVisibleCharAtPrefixAndSuffix + anonymizedText.length)
}

export const anonymizeIdentite = (text) => {
  let anonymizedText = ''
  let indiceText = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      const hidennTextInter = '*'.repeat(i - indiceText - 1)
      anonymizedText = anonymizedText + text[indiceText] + hidennTextInter + ' '
      indiceText = i + 1
    }
  }
  const hidennText = '*'.repeat(text.length - indiceText - 1)
  anonymizedText = anonymizedText + text[indiceText] + hidennText
  return anonymizedText
}

export const anonymizedControlesTechniques = (controlesTechniques) => {
  const {
    ct = [],
    ctUpdateDate,
  } = controlesTechniques

  const anonymizedCt = ct.map((ctItem) => (
    {
      ...ctItem,
      ct_immat: anonymize(ctItem.ct_immat),
      ct_vin: anonymize(ctItem.ct_vin, 3),

    }
  ))

  return {
    ct: anonymizedCt,
    ctUpdateDate,
  }
}
