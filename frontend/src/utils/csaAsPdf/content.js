import { writeFooter } from './footer'

import {
	ALIGN,
	COLUMN_WIDTH,
	FONT_SIZES,
	FONT_SPACING,
	FONT_STYLES,
	FIRST_COLUMN_X,
	SECOND_COLUMN_X,
	HORIZONTAL_TABULATION,
	IMAGE_FORMAT,
	MISSING_VALUE,
	TAB_PREFIX,
	TABBED_COLUMN_WIDTH,
	TOP_PAGE_Y
} from './constants'

import {
	getTextLinesWithSplit,
	writeMainTitle,
	writePageNumber,
	writeText,
	writeTitle,
	writeWithSpacing
} from './utils'


const writeHeaderLogo = (pdf, image, {
	imageFormat,
	width,
	height,
	x,
}={
	imageFormat: IMAGE_FORMAT.PNG,
	width: 46,
	height: 24,
	x: 82,
}) => {
	pdf.addImage(image, imageFormat, x, TOP_PAGE_Y, width, height)
}

const writeCSAMainTitle = (pdf, { spacing, y }={
	spacing: FONT_SPACING.S,
	y: 50
}) => {
	writeMainTitle(pdf, SECOND_COLUMN_X, y, 'Certificat de situation administrative détaillé')
	writeTitle(pdf, SECOND_COLUMN_X, y + spacing, '(Articles L.322-2 et R.322-4 du code de la route)', {
		align: ALIGN.CENTER,
		style: FONT_STYLES.NORMAL
	})
}

const writeVehicleIdentification = (pdf, plaque, premierCertificat, vin, marque, { y }={
	y: 67
}) => {
	writeTitle(pdf, FIRST_COLUMN_X, y, 'Identification du véhicule')

	const nextY = y + FONT_SPACING.L

	const labels = [
		'Numéro d\'immatriculation du véhicule :',
		'Date de première immatriculation du véhicule :',
		'Numéro VIN du véhicule (ou numéro de série) :',
		'Marque :'
	]
	writeWithSpacing(pdf, FIRST_COLUMN_X + HORIZONTAL_TABULATION.XS, nextY, FONT_SPACING.L, labels)

	const values = [
		plaque.toUpperCase() || MISSING_VALUE,
		premierCertificat || MISSING_VALUE,
		vin || MISSING_VALUE,
		marque || MISSING_VALUE
	]
	const lastY = writeWithSpacing(pdf, SECOND_COLUMN_X + HORIZONTAL_TABULATION.XS, nextY, FONT_SPACING.L, values)

	return lastY
}

/* **********************  writeHistory  ********************** */

const getCutIndex = (itemsWithSplit, maxNbLinesToCut) => {
	const result = itemsWithSplit.reduce(
		({ linesCount, cutIndex }, { splittedContent: { length: itemLines } }, i) => {
			const updatedLinesCount = linesCount + itemLines

			return {
				linesCount: updatedLinesCount,
				cutIndex: updatedLinesCount <= maxNbLinesToCut ? i +1 : cutIndex
			}
		},
		{ linesCount: 0, cutIndex: 0 }
	)

	return result.cutIndex
}

const getBalancedTextLinesForPage = (topY, bottomY, itemSize, itemsWithSplit) => {
	const remainingHeight = bottomY - topY
	if (remainingHeight < 0) {
		throw new Error('Error while generating CSA...')
	}
	const totalLines = itemsWithSplit.reduce((count, { splittedContent: { length: itemLines }}) => count + itemLines, 0)
	const maxColumnLinesForPage = Math.floor(remainingHeight / itemSize)
	const allLinesToWriteColumnsForAllPages = Math.ceil(totalLines / 2)
	const remainder = totalLines % 2

	const maxLineToWriteForFirstColumn = Math.min(maxColumnLinesForPage, allLinesToWriteColumnsForAllPages + remainder)
	const maxLineToWriteForSecondColumn = Math.min(maxColumnLinesForPage, allLinesToWriteColumnsForAllPages)

	const firstColumnCutIndex = getCutIndex(itemsWithSplit, maxLineToWriteForFirstColumn)
	const firstColumnItems = itemsWithSplit.slice(0, firstColumnCutIndex)

	const itemsWithoutFirstColumn = itemsWithSplit.slice(firstColumnCutIndex)

	const secondColumnCutIndex = getCutIndex(itemsWithoutFirstColumn, maxLineToWriteForSecondColumn)
	const secondColumnItems = itemsWithoutFirstColumn.slice(0, secondColumnCutIndex)

	const remainingItems = itemsWithoutFirstColumn.slice(secondColumnCutIndex)

	return {
		firstColumn: {
			x: FIRST_COLUMN_X + HORIZONTAL_TABULATION.XS,
			y: topY,
			items: firstColumnItems
		},
		secondColumn: {
			x: SECOND_COLUMN_X + HORIZONTAL_TABULATION.XS,
			y: topY,
			items: secondColumnItems
		},
		remainingItems
	}
}


const getHistoryItemsByPage = (pdf, topY, bottomY, historyItemSize, historyItems) => {
	const historyItemsWithSplit = getTextLinesWithSplit(pdf, historyItems, COLUMN_WIDTH, TABBED_COLUMN_WIDTH, TAB_PREFIX)
	let {
		firstColumn,
		secondColumn,
		remainingItems
	} = getBalancedTextLinesForPage(topY, bottomY, historyItemSize, historyItemsWithSplit)

	let pageNumber = 1
	let historyItemsByPage = {
		[pageNumber]: {
			firstColumn,
			secondColumn
		}
	}

	while (remainingItems.length) {
		(
			{
				remainingItems,
				firstColumn,
				secondColumn
			} = getBalancedTextLinesForPage(TOP_PAGE_Y + FONT_SPACING.XL, bottomY, historyItemSize, remainingItems)
		)
		pageNumber = pageNumber + 1
		historyItemsByPage[pageNumber] = {
			firstColumn,
			secondColumn
		}
	}

	return historyItemsByPage
}

const writeHistory = (pdf, y, topFooterY, historyItems, writeFooterCallback) => {
	writeTitle(pdf, FIRST_COLUMN_X, y, 'Historique du véhicule')

	const topY = y + FONT_SPACING.L
	const historyItemSize = FONT_SPACING.S
	const bottomY = topFooterY - FONT_SPACING.L
	const historyItemsByPage = getHistoryItemsByPage(pdf, topY, bottomY, historyItemSize, historyItems)
	const totalPageNumber = Object.keys(historyItemsByPage).length

	for (let [pageNumber, historyItemsForPage] of Object.entries(historyItemsByPage)) {
		if (pageNumber > 1) {
			pdf.addPage()
			writeFooterCallback(pdf)
		}
		writePageNumber(pdf, pageNumber, totalPageNumber)

		const firstColumnSplittedLines = historyItemsForPage.firstColumn.items.map(
			(item) => item.splittedContent
		).flat()

		writeWithSpacing(
			pdf,
			historyItemsForPage.firstColumn.x,
			historyItemsForPage.firstColumn.y,
			historyItemSize,
			firstColumnSplittedLines
		)

		const secondColumnSplittedLines = historyItemsForPage.secondColumn.items.map(
			(item) => item.splittedContent
		).flat()

		writeWithSpacing(
			pdf,
			historyItemsForPage.secondColumn.x,
			historyItemsForPage.secondColumn.y,
			historyItemSize,
			secondColumnSplittedLines
		)
	}
}
/* ************************************************************ */

/* ********************** writeSituation *********************** */

const writeSituationColumn = (pdf, previousY, situationItems, { x, y }) => {
	const newY = previousY + y

	let offset = FONT_SPACING.L
	situationItems.forEach(item => {
		const titleX = x + HORIZONTAL_TABULATION.XS
		const titleY = newY + offset
		writeText(pdf, titleX, titleY, item.key, {
			size: FONT_SIZES.M,
			style: FONT_STYLES.BOLD
		})
		offset = offset + FONT_SPACING.XS * (item.key.split('\n').length - 1) + FONT_SPACING.XS

		item.values.forEach((value, i) => {
			const valueX = x + HORIZONTAL_TABULATION.S
			const valueY = newY + offset

			writeText(pdf, valueX, valueY, value)
			const spacing = (i === item.values.length-1) ? FONT_SPACING.M : FONT_SPACING.XS
			offset = offset + FONT_SPACING.XS * (value.split('\n').length - 1) + spacing
		})
	})

	const lastY = newY + offset
	return lastY
}

const writeFirstSituationColumn = (pdf, previousY, { otci, pv, ove, hasPVE, saisie, gage, x, y }
) => {
	const situationItems = [
		{
			key: '- Opposition au transfert du certificat\n  d\'immatriculation (OTCI)',
			values: [
				otci === 'Aucune' ? 'Aucune' : (pv ? 'PV en attente' : 'Oui'),
			]
		},
		{
			key: '- Procédure de réparation contrôlée',
			values: [
				ove !== 'Aucune' || (hasPVE ? 'Oui' : 'Aucune')
			]
		},
		{
			key: '- Déclaration valant saisie',
			values: [
				saisie
			]
		},
		{
			key: '- Gage',
			values: [
				gage
			]
		}
	]

	return writeSituationColumn(pdf, previousY, situationItems, { x, y })
}

const writeSecondSituationColumn = (pdf, previousY, { annulation, volVehicule, volTitre, perteTitre, duplicataTitre, suspension, suspensions, x, y }) => {
	const situationItems = [
		{
			key: '- Immatriculation suspendue',
			values: [
				(suspension !== 'Non') ? suspensions.join(', ') : 'Non'
			]
		},
		{
			key: '- Immatriculation annulée',
			values: [
				annulation
			]
		},
		{
			key: '- Véhicule volé',
			values: [
				volVehicule === 'NON' ? 'Non' : 'Oui'
			]
		},
		{
			key: '- Certificat d\'immatriculation volé',
			values: [
				volTitre === 'NON' ? 'Non' : 'Oui'
			]
		},
		{
			key: '- Certificat d\'immatriculation perdu',
			values: [
				perteTitre === 'NON' ? 'Non' : 'Oui'
			]
		},
		{
			key: '- Certificat d\'immatriculation duplicata',
			values: [
				duplicataTitre === 'NON' ? 'Non' : 'Oui'
			]
		}
	]

	return writeSituationColumn(pdf, previousY, situationItems, { x, y })
}

const writeSituation = (pdf, previousY, {
	annulation,
	duplicataTitre,
	gage,
	hasPVE,
	otci,
	ove,
	perteTitre,
	pv,
	saisie,
	suspension,
	suspensions,
	volTitre,
	volVehicule
},
{ y }={
	y: 7
}) => {
	const newY = previousY + y
	writeTitle(pdf, FIRST_COLUMN_X, newY, 'Situation administrative du véhicule')
	const lastFirstY = writeFirstSituationColumn(pdf, previousY, { gage, hasPVE, otci, ove, pv, saisie, x: FIRST_COLUMN_X, y })
	const lastSecondY = writeSecondSituationColumn(pdf, previousY, { annulation, duplicataTitre, perteTitre, suspension, suspensions, volTitre, volVehicule, x: SECOND_COLUMN_X, y })
	return Math.max(lastFirstY, lastSecondY)
}

const writeAnnulation = (pdf, dateAnnulation, { y }={
	y: 107
}) => {
	writeTitle(pdf, FIRST_COLUMN_X, y, 'Le certificat demandé a été annulé.')
	writeTitle(pdf, FIRST_COLUMN_X, y + FONT_SPACING.L, `Immatriculation annulée le : ${dateAnnulation}.`)
}
/* ************************************************************ */

/* ********************** CONTENT ********************** */
export const writeContent = (pdf, {
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
	const writeFooterCallback = (pdf) => {
		return writeFooter(pdf, { histoVecLogo, qrCodeUrl, validityDate, webSiteUrl })
	}

	writeHeaderLogo(pdf, marianneImage)
	writeCSAMainTitle(pdf)

	if (annulation === 'Oui') {
		writeAnnulation(pdf, dateAnnulation)
		writeFooterCallback(pdf)
		return
	}

	const vehicleIdentificationY = writeVehicleIdentification(pdf, plaque, premierCertificat, vin, marque)

	const situationY = writeSituation(pdf, vehicleIdentificationY + FONT_SPACING.M, {
		annulation,
		duplicataTitre,
		gage,
		hasPVE,
		otci,
		ove,
		perteTitre,
		pv,
		saisie,
		suspension,
		suspensions,
		volTitre,
		volVehicule
	})

	const { topY: topFooterY } = writeFooterCallback(pdf)
	writeHistory(pdf, situationY + FONT_SPACING.M, topFooterY, historyItems, writeFooterCallback)
}
