export const downloadBlob = (blob, filename) => {
  const blobUrl = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = blobUrl
  a.download = filename || 'download'

  // Make the download to happen automatically without attaching the anchor element to the DOM
  a.click()

  // Usefull to release blobUrl when finished
  return blobUrl
}
