import jsPDF from 'jspdf'

import { writeContent } from './content'
import { FONT } from './constants'

export const generateCsa = ({
	annulation,
	dateAnnulation,
	duplicataTitre,
	gage,
	hasPVE,
	historyItems,
	histoVecLogo,
	marianneImage,
	marque,
	ove,
	otci,
	perteTitre,
	plaque,
	premierCertificat,
	pv,
	qrCodeUrl,
	saisie,
	suspension,
	suspensions,
	validityDate,
	vin,
	volTitre,
	volVehicule,
	webSiteUrl
}) => {
	const pdf = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		putOnlyUsedFonts: true,
		compress: true
	})

	pdf.setFont(FONT)

	writeContent(pdf, {
		annulation,
		dateAnnulation,
		duplicataTitre,
		gage,
		hasPVE,
		historyItems,
		histoVecLogo,
		marianneImage,
		marque,
		ove,
		otci,
		perteTitre,
		plaque,
		premierCertificat,
		pv,
		qrCodeUrl,
		saisie,
		suspension,
		suspensions,
		validityDate,
		vin,
		volTitre,
		volVehicule,
		webSiteUrl
	})

	pdf.save('rapport.pdf')
}
