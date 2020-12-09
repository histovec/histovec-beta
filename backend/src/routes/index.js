import express from 'express'
import config from '../config'
import { generateGetReport } from './report'
import { sendContact } from './feedback'

// @todo : use hapi and joi to validate req.body for every endpoint
const getRouter = (utacClient) => {
  const router = express.Router()
  const getReport = generateGetReport(utacClient)

  router.get('/version', (req, res) => res.send({ version: config.version }))
  router.get('/health', (req, res) => res.send({ status: 'ok' }))
  router.post('/report', getReport)
  router.post('/contact', sendContact)

  return router
}

export default getRouter
