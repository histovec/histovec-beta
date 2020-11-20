// This is the bridge between data pipeline logic and web application logic

// Useful to build id and key
export const normalizeAsDataPreparation = (text) =>
  text.toLowerCase().replace(/[^0-9a-z]/g, '')
