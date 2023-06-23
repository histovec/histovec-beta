export const reponseRequeteApi200 = {
  status: 200,
  message: 'OK',
  data: {
    payload: {
      vehicule: 'test',
    },
  },
}

export const reponseRequeteApi404 = {
  status: 404,
  message: 'OK',
}

export const reponseRequeteApiErreur500 = {
  response: {
    status: 500,
    statusText: 'Service Unavailable',
  },
}
