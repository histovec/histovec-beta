import { PDFDocument } from 'pdf-lib'

import { writeContent } from './content.js'
import { FONT, FONT_BOLD, FONT_ITALIC, FONT_STYLES, RAPPORT_FILENAME } from './constants.js'


export const generateCsa = async (
	// Complete CSA and annulation
	{
		isCIAnnule,
		annulationCurrentStatus,
		dateAnnulationCI,
		dateDonnees,
		histoVecLogoBytes,
		marianneImageBytes,
		marque,
		plaque,
		premierCertificat,
		qrCodeUrl,
		validityDate,
		vin,
		webSiteUrl,
	},
	// Only complete CSA
	{
		duplicataTitre,
		dvsCurrentStatusLines,
		gagesCurrentStatusLines,
		historyItems,
		otcisCurrentStatusLines,
		otcisPVCurrentStatusLines,
		oveisCurrentStatusLines,
		ovesCurrentStatusLines,
		perteTitre,
		proceduresReparationControleeStatus,
		suspensionsCurrentStatusLines,
		volTitre,
		volVehicule,
	} = {},
) => {
	const doc = await PDFDocument.create()

	const font = await doc.embedFont(FONT)
	const fontItalic = await doc.embedFont(FONT_ITALIC)
	const fontBold = await doc.embedFont(FONT_BOLD)

	const embeddedFonts = {
		[FONT_STYLES.NORMAL]: font,
		[FONT_STYLES.ITALIC]: fontItalic,
		[FONT_STYLES.BOLD]: fontBold,
	}

	const headerLogoPng = await doc.embedPng(marianneImageBytes)
	const footerLogoPng = await doc.embedPng(histoVecLogoBytes)

	const embeddedLogos = {
		headerLogoPng,
		footerLogoPng,
	}

	writeContent(
		{
			doc,
			embeddedFonts,
			embeddedLogos,
			isCIAnnule,
			annulationCurrentStatus,
			dateAnnulationCI,
			dateDonnees,
			marque,
			plaque,
			premierCertificat,
			qrCodeUrl,
			validityDate,
			vin,
			webSiteUrl,
		},
		(
			!isCIAnnule ? {
				duplicataTitre,
				dvsCurrentStatusLines,
				gagesCurrentStatusLines,
				historyItems,
				otcisCurrentStatusLines,
				otcisPVCurrentStatusLines,
				oveisCurrentStatusLines,
				ovesCurrentStatusLines,
				perteTitre,
				proceduresReparationControleeStatus,
				suspensionsCurrentStatusLines,
				volTitre,
				volVehicule,
			} : {}
		),
	)

	// Returns pdf bytes that can be:
	//   • Written to a file in Node
	//   • Downloaded from the browser
	//   • Rendered in an <iframe>
	//   etc.
	const pdfBytes = await doc.save(`${RAPPORT_FILENAME}.pdf`)

	return pdfBytes
}
