import Qr from 'qr.js'

import {
	FIRST_COLUMN_X,
	FONT_SIZES,
	FONT_STYLES,
	FONT_SPACING,
	HORIZONTAL_TABULATION,
	IMAGE_FORMAT,
	QR_CODE_PIXEL_SIZE
} from './constants'
import { padString, writeText, writeTitle, writeWithSpacing } from './utils'


/* ********************** QR CODE ********************** */
const drawQrCode = (
	pdf, qrCodeUrl,
	{ dryRun }={ dryRun: false },
	{ x, y }={ x: 170, y: 257 }
) => {
	if (!dryRun) {
		const qrCode = Qr(qrCodeUrl)
		qrCode.modules.forEach((row, i) => {
			row.forEach((cell, j) => {
				if (cell === true) {
					pdf.rect(
						x + j * QR_CODE_PIXEL_SIZE,
						y + i * QR_CODE_PIXEL_SIZE,
						QR_CODE_PIXEL_SIZE,
						QR_CODE_PIXEL_SIZE,
						'F'
					)
				}
			})
		})
	}
	return { topY: y }
}

const writeQrCodeText = (
	pdf, baseUrl,
	{ dryRun }={ dryRun: false },
	{	x, y, rotation }={ x: 169, y: 281, rotation: 90 }
) => {
	if(!dryRun) {
		writeText(pdf, x, y, baseUrl, {
			size: FONT_SIZES.XS,
			rotation
		})
	}

	return { topY: y }
}

const writeQrCodeLogo = (
	pdf, image,
	{ dryRun }={ dryRun: false },
	{	imageFormat, x, y, width, height }={
		imageFormat: IMAGE_FORMAT.PNG,
		x: 170,
		y: 241,
		width: 24,
		height: 15
	}
) => {
	if (!dryRun) {
		pdf.addImage(image, imageFormat, x, y, width, height)
	}

	return { topY: y }
}

const writeCSAQrCode = (
	pdf, histoVecLogo, qrCodeUrl, webSiteUrl,
	{ dryRun }={ dryRun: false }
) => {
	const { topY: qrCodeTopY } = drawQrCode(pdf, qrCodeUrl, { dryRun })
	const { topY: qrCodeTextTopY } = writeQrCodeText(pdf, webSiteUrl, { dryRun })
	const { topY: qrCodeLogoTopY } = writeQrCodeLogo(pdf, histoVecLogo, { dryRun })

	return { topY: Math.min(qrCodeTopY, qrCodeTextTopY, qrCodeLogoTopY) }
}


/* ********************** DATE DE VALIDITÉ ********************** */

const writeValidityDate = (
	pdf,
	{ dryRun }={ dryRun: false },
	{ y }={ y: 245 }
) => {
	const date = new Date()
	const humanReadableDateString = date.toLocaleDateString('fr-FR', {
		weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
	})
	const humanReadableHourString = `${padString(date.getHours(), 2)}h${padString(date.getMinutes(), 2)}`

	if (!dryRun) {
		writeTitle(pdf, FIRST_COLUMN_X, y, 'Certificat attestant la situation administrative au :')
		writeText(
			pdf,
			FIRST_COLUMN_X + HORIZONTAL_TABULATION.XS,
			y + FONT_SPACING.L,
			`${humanReadableDateString} à ${humanReadableHourString}`,
			{ size: FONT_SIZES.M }
		)
	}

	return { topY: y }
}

/* ********************** MENTIONS LEGALES ********************** */

const writeLegalNotice = (
	pdf, validityDate, webSiteUrl,
	{ dryRun }={ dryRun: false },
	{ y }={ y: 262 }
) => {
	const textLines = [
		'La valeur du certificat de situation administrative détaillé ne saurait excéder 15 jours, les données étant susceptibles',
		'd\'évoluer. Le QR code ci-contre renvoie au site ' + webSiteUrl + ' - il permet de vous assurer de la',
		'conformité des informations retranscrites et de leurs mises à jour. Ce code sera disponible jusqu\'au changement de',
		'titulaire et au plus tard jusqu\'au ' + validityDate + '. Au-delà, un nouveau rapport devra être généré.'
	]

	if (!dryRun) {
		writeWithSpacing(pdf, FIRST_COLUMN_X, y, FONT_SPACING.S, textLines,
		{ dryRun },
		{
			size: FONT_SIZES.S,
			style: FONT_STYLES.ITALIC
		})
	}

	return { topY: y }
}


/* ********************** FOOTER ********************** */
export const writeFooter = (
	pdf,
	{ histoVecLogo, qrCodeUrl, validityDate, webSiteUrl },
	{ dryRun }
) => {
	const { topY: validityDateTopY } = writeValidityDate(pdf, { dryRun })
	const { topY: legalNoticeTopY } = writeLegalNotice(pdf, validityDate, webSiteUrl, { dryRun })
	const { topY: qrCodeTopY } = writeCSAQrCode(pdf, histoVecLogo, qrCodeUrl, webSiteUrl, { dryRun })

	return { topY: Math.min(validityDateTopY, legalNoticeTopY, qrCodeTopY) }
}
