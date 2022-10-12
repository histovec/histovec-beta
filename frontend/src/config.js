import { isTrue } from './utils/envFormat';

const apiUrl = `/${import.meta.env.VITE_TITLE}/api/v1`

const config = {
  isHistovecUnavailable: isTrue(import.meta.env.VITE_IS_HISTOVEC_UNAVAILABLE),
}

export {
  apiUrl,
  config,
}
