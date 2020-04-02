import jsPDF from 'jspdf'

import { writeContent } from './content'
import { FONT, RAPPORT_FILENAME } from './constants'

export const generateCsa = (
	// Complete CSA and annulation
	{
		isAnnulationCI,
		annulationCurrentStatus,
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
		dvsCurrentStatusLines,
		gagesCurrentStatusLines,
		historyItems,
		otcisCurrentStatusLines,
		otcisPvCurrentStatusLines,
		oveisCurrentStatusLines,
		perteTitre,
		procedureReparationControleeStatus,
		suspensionCurrentStatusLines,
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

	writeContent(pdf,
		{
			isAnnulationCI,
			annulationCurrentStatus,
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
		(
			!isAnnulationCI ? {
				duplicataTitre,
				dvsCurrentStatusLines,
				gagesCurrentStatusLines,
				historyItems,
				otcisCurrentStatusLines,
				otcisPvCurrentStatusLines,
				oveisCurrentStatusLines,
				perteTitre,
				procedureReparationControleeStatus,
				suspensionCurrentStatusLines,
				volTitre,
				volVehicule,
			} : {}
		)
	)

	pdf.save(`${RAPPORT_FILENAME}.pdf`)
}
