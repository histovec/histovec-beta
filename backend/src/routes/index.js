import express from 'express'

import { getHistoVec, getOTC, streamedReport } from './report'
// import feedback from './feedback'
const router = express.Router()

router.post('/id', getHistoVec)
router.post('/otc', getOTC)
router.get('/stream', streamedReport)
// router.use('/feedback', feedback)

export default router
