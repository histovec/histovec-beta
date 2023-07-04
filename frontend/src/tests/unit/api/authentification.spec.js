import { describe, expect, vi, it } from 'vitest'
import axios from 'axios'
import api from '@Api/index.js'
import {
  reponseAuthentification200,
  reponseAuthentification500,
  reponseAuthentification403,
} from '@/tests/fixtures/index'

vi.mock('axios')

describe('Authentification', () => {
  it('Doit se connecter à l\'api data', async () => {
    axios.post.mockResolvedValue(reponseAuthentification200)
    await api.authentication()

    expect(axios.defaults.headers.common.Authorization)
      .toStrictEqual('Bearer '.concat(reponseAuthentification200.data.access_token))
  })
  it('Doit ratter la première authentification et se connecter à la deuxième tentative', async () => {
    axios.post
      .mockImplementationOnce(() => Promise.reject(reponseAuthentification500))
      .mockImplementationOnce(() => Promise.resolve(reponseAuthentification200))
    await api.authentication()

    expect(axios.defaults.headers.common.Authorization)
      .toStrictEqual('Bearer '.concat(reponseAuthentification200.data.access_token))
  })
  it('Doit ratter les deux authentifications', async () => {
    axios.post.mockRejectedValue(reponseAuthentification500)
    await api.authentication()

    expect(axios.defaults.headers.common.Authorization)
      .toStrictEqual(null)
  })
  it('Doit ratter la premère authentifications sans pouvoir faire une deuxème', async () => {
    axios.post
      .mockImplementationOnce(() => Promise.reject(reponseAuthentification403))
      .mockImplementationOnce(() => Promise.resolve(reponseAuthentification200))
    await api.authentication()

    expect(axios.defaults.headers.common.Authorization)
      .toStrictEqual(null)
  })
})
