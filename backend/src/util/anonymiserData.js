export const anonymize = (text, nbVisibleCharAtPrefixAndSuffix = 2) => {
  if (text.length > 4) {
    const anonymizedText = '*'.repeat(text.length - nbVisibleCharAtPrefixAndSuffix * 2)
    return text.substr(0, nbVisibleCharAtPrefixAndSuffix) + anonymizedText + text.substr(nbVisibleCharAtPrefixAndSuffix + anonymizedText.length)
  } else {
    const shortAnonymizedText = '*'.repeat(text.length - 1)
    return text[0] + shortAnonymizedText
  }
}
