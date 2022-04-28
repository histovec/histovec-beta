import Qr from 'qr.js'

import {
	BORDER_LEFT_PAGE_X,
	DEFAULT_RGB_COLOR,
	FONT_SIZES,
	FONT_STYLES,
	FONT_SPACING,
	FOOTER_LOGO_X,
	HORIZONTAL_TABULATION,
	QR_CODE_PIXEL_SIZE,
	TOP_FOOTER_MARGIN,
} from './constants.js'
import { drawFilledRectangle, writeText, writeTitle, writeWithSpacing } from './utils.js'
import { formatIsoToHumanReadableFrDate, padString } from '@/assets/js/format.js'

/* ********************** QR CODE ********************** */
const drawQrCode = ({
	page,
	x,
	y,
	qrCodeUrl,
}) => {
	const qrCode = Qr(qrCodeUrl)

	if (!qrCode.modules.length) {
		console.error(`Unable to create QrCode using url ${qrCodeUrl}`) // eslint-disable-line no-console
		return
	}

	let qrCodeBottomY
	qrCode.modules.forEach((row, i) => {
		row.forEach((cell, j) => {
			if (cell === true) {
				qrCodeBottomY = y - i * QR_CODE_PIXEL_SIZE - QR_CODE_PIXEL_SIZE

				drawFilledRectangle({
					page,
					x: x + j * QR_CODE_PIXEL_SIZE,
					y: y - i * QR_CODE_PIXEL_SIZE,
					width: QR_CODE_PIXEL_SIZE,
					height: QR_CODE_PIXEL_SIZE,
					color: DEFAULT_RGB_COLOR,
				})
			}
		})
	})

	return qrCodeBottomY
}

const writeVerticalUrl = ({
	page,
	embeddedFonts,
	x,
	y,
	qrCodeUrl,
}) => {
	const truncatedQrCodeUrl = `${qrCodeUrl.substring(0, 30)}...`
	writeText({
		page,
		embeddedFonts,
		x,
		y,
		text: truncatedQrCodeUrl,
		size: FONT_SIZES.XS,
		rotationAngle: 90,
	})
}

const writeQrCodeLogoPng = ({
	page,
	x,
	y,
	footerLogoPng,
}) => {
	const pngDims = footerLogoPng.scale(0.26)
	const pngY = y - pngDims.height

	page.drawImage(footerLogoPng, {
		x,
		y: pngY,
		width: pngDims.width,
		height: pngDims.height,
	})

	const nextY = pngY - FONT_SPACING.M
	return nextY
}

const writeCSAQrCode = ({
	page,
	embeddedFonts,
	x,
	y,
	footerLogoPng,
	qrCodeUrl,
}) => {
	const qrCodeY = writeQrCodeLogoPng({ page, x, y, footerLogoPng })
	const qrCodeBottomY = drawQrCode({ page, x, y: qrCodeY, qrCodeUrl })

	const qrCodeTextX = x - FONT_SPACING.S
	writeVerticalUrl({ page, embeddedFonts, x: qrCodeTextX, y: qrCodeBottomY, qrCodeUrl })

	const nextY = qrCodeBottomY - FONT_SPACING.M
	return nextY
}


/* ********************** DATE DE VALIDITÉ ********************** */

const writeValidityDate = ({
	page,
	embeddedFonts,
	x,
	y,
	dateDonnees,
}) => {
	const now = new Date()
	const nowHumanReadableDateString = now.toLocaleDateString(
		'fr-FR',
		{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
	)
	const nowHumanReadableHourString = `${padString(now.getHours(), 2)}h${padString(now.getMinutes(), 2)}`

	const validityDateTextY = writeTitle({
		page,
		embeddedFonts,
		x: BORDER_LEFT_PAGE_X,
		y,
		title: 'Certificat attestant la situation administrative au :',
	})

	const dateDonneesHumanReadableDateString = formatIsoToHumanReadableFrDate(dateDonnees)

	const datesText = (
		dateDonnees ?
			`${dateDonneesHumanReadableDateString} (généré le ${nowHumanReadableDateString} à ${nowHumanReadableHourString})` :
			`${nowHumanReadableDateString} à ${nowHumanReadableHourString}`
	)

	const validityDateEndY = writeText({
		page,
		embeddedFonts,
		x: x + HORIZONTAL_TABULATION.XS,
		y: validityDateTextY,
		text: datesText,
		size: FONT_SIZES.M,
		style: FONT_STYLES.BOLD,
	})

	const nextY = validityDateEndY - FONT_SPACING.XXXL
	return nextY
}


/* ********************** MENTIONS LEGALES ********************** */

const writeLegalNotice = ({
	page,
	embeddedFonts,
	x,
	y,
	validityDate,
	webSiteUrl,
}) => {
	const textLines = [
		'La valeur du certificat de situation administrative détaillé ne saurait excéder 15 jours, les données étant susceptibles',
		'd\'évoluer. Le QR code ci-contre renvoie au site ' + webSiteUrl + ' - il permet de vous assurer de la',
		'conformité des informations retranscrites et de leurs mises à jour. Ce code sera disponible jusqu\'au changement de',
		'titulaire et au plus tard jusqu\'au ' + validityDate + '. Au-delà, un nouveau rapport devra être généré.',
	]

	writeWithSpacing({
		page,
		embeddedFonts,
		x,
		y,
		textLines,
		increaseLineHeightOf: 6,
		size: FONT_SIZES.S,
		style: FONT_STYLES.ITALIC,
	})
}


/* ********************** FOOTER ********************** */
export const writeFooter = ({
	page,
	embeddedFonts,
	dateDonnees,
	footerLogoPng,
	qrCodeUrl,
	validityDate,
	webSiteUrl,
}) => {
	const { height } = page.getSize()
	const topFooterY = height - TOP_FOOTER_MARGIN

	const legalNoticeY = writeValidityDate({
		page,
		embeddedFonts,
		x: BORDER_LEFT_PAGE_X,
		y: topFooterY,
		dateDonnees,
	})

	writeLegalNotice({
		page,
		embeddedFonts,
		x: BORDER_LEFT_PAGE_X,
		y: legalNoticeY,
		validityDate,
		webSiteUrl,
	})

	const bottomFooterY = writeCSAQrCode({
		page,
		embeddedFonts,
		x: FOOTER_LOGO_X,
		y: topFooterY,
		footerLogoPng,
		qrCodeUrl,
	})

	return { topFooterY, bottomFooterY }
}
