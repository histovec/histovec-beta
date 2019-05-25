import express from 'express'
import { config } from '../config'
import { getHistoVec, getOTC, streamedReport } from './report'
// import feedback from './feedback'
const router = express.Router()

router.get('/version', (req, res) => res.send({ version: config.version }))
router.get('/health', (req, res) => res.send({ status: 'ok' }))
router.post('/id', getHistoVec)
router.post('/otc', getOTC)
router.get('/stream', streamedReport)

// router.use('/feedback', feedback)

export default router
