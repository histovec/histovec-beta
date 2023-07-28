const apiUrl = import.meta.env.VITE_STUB_ACTIVATED==='true'?`${import.meta.env.VITE_BASE_URL_STUB}/public/v1`:`${import.meta.env.VITE_BASE_URL_API_DATA}/public/v1`

export {
  apiUrl,
}
