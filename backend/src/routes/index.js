import express from 'express'

import { reportStream } from './report'
// import feedback from './feedback'
const router = express.Router()

router.post('/id', reportStream)
// router.use('/feedback', feedback)

export default router
