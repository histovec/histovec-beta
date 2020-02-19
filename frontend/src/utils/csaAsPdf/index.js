import jsPDF from 'jspdf'

import { writeContent } from './content'
import { FONT, RAPPORT_FILENAME } from './constants'

export const generateCsa = (
	// Complete CSA and annulation
	{
		annulation,
		dateAnnulation,
		histoVecLogo,
		marianneImage,
		marque,
		plaque,
		premierCertificat,
		qrCodeUrl,
		validityDate,
		vin,
		webSiteUrl
	},
	// Only complete CSA
	{
		duplicataTitre,
		gage,
		hasPVE,
		historyItems,
		ove,
		otci,
		perteTitre,
		pv,
		saisie,
		suspension,
		suspensions,
		volTitre,
		volVehicule,
	}={}
) => {
	const pdf = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		putOnlyUsedFonts: true,
		compress: true
	})

	pdf.setFont(FONT)


	if (annulation === 'Oui') {
		writeContent(pdf,
			{
				annulation,
				dateAnnulation,
				histoVecLogo,
				marianneImage,
				marque,
				plaque,
				premierCertificat,
				qrCodeUrl,
				validityDate,
				vin,
				webSiteUrl
			}
		)
	} else {
		writeContent(pdf,
			{
				annulation,
				dateAnnulation,
				histoVecLogo,
				marianneImage,
				marque,
				plaque,
				premierCertificat,
				qrCodeUrl,
				validityDate,
				vin,
				webSiteUrl
			},
			// Only complete CSA
			{
				duplicataTitre,
				gage,
				hasPVE,
				historyItems,
				ove,
				otci,
				perteTitre,
				pv,
				saisie,
				suspension,
				suspensions,
				volTitre,
				volVehicule,
			}
		)
	}

	pdf.save(`${RAPPORT_FILENAME}.pdf`)
}
