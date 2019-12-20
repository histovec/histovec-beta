import express from 'express'
import config from '../config'
import { getSIV, generateGetUTAC } from './report'
import { sendFeedback, sendContact } from './feedback'

export default function getRouter(utacClient) {
	const router = express.Router()
	const getUTAC = generateGetUTAC(utacClient)

	router.get('/version', (req, res) => res.send({ version: config.version }))
	router.get('/health', (req, res) => res.send({ status: 'ok' }))
	router.post('/siv', getSIV)
	router.post('/utac', getUTAC)
	router.post('/feedback', sendFeedback)
	router.post('/contact', sendContact)

	return router
}
