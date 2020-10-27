import { writeFooter } from './footer'

import {
	ALIGN,
	FONT_SIZES,
	FONT_SPACING,
	FONT_STYLES,
	FIRST_COLUMN_X,
	SECOND_COLUMN_X,
	NEXT_PAGE_SYMBOL_X,
	HORIZONTAL_TABULATION,
	IMAGE_FORMAT,
	MISSING_VALUE,
	TO_BE_CONTINUED_SYMBOL,
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


const writeNextPageSymbol = (pdf, y) => {
	writeText(pdf, NEXT_PAGE_SYMBOL_X, y, TO_BE_CONTINUED_SYMBOL,
		{
			size: FONT_SIZES.M,
			style: FONT_STYLES.BOLD
		})
}

const writeHeaderLogo = (
	pdf, image,
	{ imageFormat, width, height,	x}={
		imageFormat: IMAGE_FORMAT.PNG,
		width: 43.4,
		height: 32.86,
		x: 83.2,
	}
) => {
	pdf.addImage(image, imageFormat, x, TOP_PAGE_Y, width, height, null, 'SLOW')
	return TOP_PAGE_Y + height + FONT_SPACING.XS
}

const writeCSAMainTitle = (pdf, y) => {
	writeMainTitle(pdf, SECOND_COLUMN_X, y, 'Certificat de situation administrative détaillé')
	const titleY = writeTitle(pdf, SECOND_COLUMN_X, y + FONT_SPACING.S, '(Articles L.322-2 et R.322-4 du code de la route)', {
		align: ALIGN.CENTER,
		style: FONT_STYLES.NORMAL
	})

	return titleY + FONT_SPACING.L * 2
}

const writeVehicleIdentification = (
	pdf, plaque, premierCertificat, vin, marque,
	{ y }={ y: 65 }
) => {
	writeTitle(pdf, FIRST_COLUMN_X, y, 'Identification du véhicule')

	const nextY = y + FONT_SPACING.L

	const labels = [
		'Numéro d\'immatriculation du véhicule :',
		'Date de première immatriculation du véhicule :',
		'Numéro VIN du véhicule (ou numéro de série) :',
		'Marque :'
	]
	writeWithSpacing(pdf, FIRST_COLUMN_X + HORIZONTAL_TABULATION.XS, nextY, FONT_SPACING.S, labels)

	const values = [
		plaque.toUpperCase() || MISSING_VALUE,
		premierCertificat || MISSING_VALUE,
		vin || MISSING_VALUE,
		marque || MISSING_VALUE
	]
	const lastY = writeWithSpacing(pdf, SECOND_COLUMN_X + HORIZONTAL_TABULATION.XS, nextY, FONT_SPACING.S, values)

	return lastY + FONT_SPACING.M
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

const getBalancedTextLinesForPage = (
	topY, remainingHeight, maxColumnLinesForPage, itemsWithSplit,
	{ onlyOneColumn }={ onlyOneColumn: false }
) => {
	if (remainingHeight < 0) {
		throw new Error('Bad use for getBalancedTextLinesForPage...')
	}

	if (onlyOneColumn && itemsWithSplit.length > maxColumnLinesForPage) {
		throw new Error('Bad use for getBalancedTextLinesForPage...')
	}

	if (onlyOneColumn) {
		return {
			firstColumn: {
				x: FIRST_COLUMN_X + HORIZONTAL_TABULATION.XS,
				y: topY,
				items: itemsWithSplit
			},
			remainingItems: []
		}
	}

	const totalLines = itemsWithSplit.reduce((count, { splittedContent: { length: itemLines }}) => count + itemLines, 0)
	const maxLinesForPage = maxColumnLinesForPage * 2

	const totalLinesToWriteForPage = totalLines < maxLinesForPage ? totalLines : maxLinesForPage
	const remainder = totalLinesToWriteForPage % 2

	const getMaxLineToWriteForColumn = (itemsLength) => {
		if (itemsLength === 1) {
			return maxColumnLinesForPage
		}

		return Math.min(maxColumnLinesForPage, Math.floor(totalLinesToWriteForPage / 2) + remainder)
	}

	const firstColumnCutIndex = getCutIndex(itemsWithSplit, getMaxLineToWriteForColumn(itemsWithSplit.length))
	const firstColumnItems = itemsWithSplit.slice(0, firstColumnCutIndex)

	const itemsWithoutFirstColumn = itemsWithSplit.slice(firstColumnCutIndex)

	const secondColumnCutIndex = getCutIndex(itemsWithoutFirstColumn, getMaxLineToWriteForColumn(itemsWithoutFirstColumn.length))
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

const getHistoryItemsByPage = (
	pdf, firstPageTopY, bottomY, bottomHistoryTitleForNextPage, historyItemSize, historyItems,
	{ forceTwoColumns } = { forceTwoColumns: false }
) => {
	let remainingHeight = bottomY - firstPageTopY
	let maxColumnLinesForPage = Math.floor(remainingHeight / historyItemSize)

	let historyItemsWithSplit, firstColumn, secondColumn, remainingItems

	// All lines fit in first page and one column
	if (historyItems.length <= maxColumnLinesForPage && !forceTwoColumns ) {
		historyItemsWithSplit = getTextLinesWithSplit(pdf, historyItems, { onlyOneColumn: true });
		({
			firstColumn,
			secondColumn,
			remainingItems
		} = getBalancedTextLinesForPage(firstPageTopY, remainingHeight, maxColumnLinesForPage, historyItemsWithSplit, { onlyOneColumn: true })
		)

	} else {  // First page with many columns
		historyItemsWithSplit = getTextLinesWithSplit(pdf, historyItems);
		({
			firstColumn,
			secondColumn,
			remainingItems
		} = getBalancedTextLinesForPage(firstPageTopY, remainingHeight, maxColumnLinesForPage, historyItemsWithSplit)
		)
	}

	let pageNumber = 1
	let historyItemsByPage = {
		[pageNumber]: {
			firstColumn,
			secondColumn
		}
	}

	while (remainingItems.length) {
		remainingHeight = bottomY - bottomHistoryTitleForNextPage
		maxColumnLinesForPage = Math.floor(remainingHeight / historyItemSize);

		// Always display 2 columns for next pages since first page has 2 columns
		({
			firstColumn,
			secondColumn,
			remainingItems
		} = getBalancedTextLinesForPage(bottomHistoryTitleForNextPage, remainingHeight, maxColumnLinesForPage, remainingItems))

		pageNumber = pageNumber + 1
		historyItemsByPage[pageNumber] = {
			firstColumn,
			secondColumn
		}
	}

	return historyItemsByPage
}


const addPage = (pdf, writeHeaderCallback, writeFooterCallback, title) => {
	pdf.addPage()
	const nextY = writeHeaderCallback(pdf)
	if (title) {
		writeTitle(pdf, FIRST_COLUMN_X, nextY, title)
	}
	writeFooterCallback(pdf)
}

const writeHistory = (
	pdf, y, topFooterY, bottomHistoryTitleForNextPage, historyItems, plaque, writeFooterCallback, writeHeaderCallback,
	{ dryRun, forceTwoColumns, nextPageSymbol }={ dryRun: false, forceTwoColumns: false, nextPageSymbol: false },
	{ totalPageCount }={ totalPageCount: null }
) => {
	if (!dryRun) {
		writeTitle(pdf, FIRST_COLUMN_X, y, 'Historique du véhicule')
	} else {
		// force a fake write to configure the method pdf.splitTextToSize while using dryRun
		// (this method need some text on pdf to know font size and correctly split text)
		writeTitle(pdf, FIRST_COLUMN_X, -10, 'Fake')
	}
	const topY = y + FONT_SPACING.L
	const historyItemSize = FONT_SPACING.S
	const historyItemsByPage = getHistoryItemsByPage(
		pdf, topY, topFooterY, bottomHistoryTitleForNextPage, historyItemSize, historyItems,
		{ forceTwoColumns }
	)
	const totalPageNumber =  totalPageCount ? totalPageCount : Object.keys(historyItemsByPage).length

	let firstColumnLastY = y
	let secondColumnLastY = y
	let firstPageColumnsCount = 0
	let lastY = y
	let pageNumber
	let hasSymbol = false

	for (let [pageNumberStr, historyItemsForPage] of Object.entries(historyItemsByPage)) {
		pageNumber = parseInt(pageNumberStr)
		if (!dryRun) {
			if (pageNumber > 1) {
				addPage(pdf, writeHeaderCallback, writeFooterCallback, `Suite historique du véhicule - ${plaque}`)
			}
			writePageNumber(pdf, pageNumber, totalPageNumber)
		}
		const firstColumnSplittedLines = historyItemsForPage.firstColumn.items.map(
			(item) => item.splittedContent
		).flat()

		firstColumnLastY = writeWithSpacing(
			pdf,
			historyItemsForPage.firstColumn.x,
			historyItemsForPage.firstColumn.y,
			historyItemSize,
			firstColumnSplittedLines,
			{ dryRun }
		)

		if (historyItemsForPage.secondColumn) {
			const secondColumnSplittedLines = historyItemsForPage.secondColumn.items.map(
				(item) => item.splittedContent
			).flat()

			secondColumnLastY = writeWithSpacing(
				pdf,
				historyItemsForPage.secondColumn.x,
				historyItemsForPage.secondColumn.y,
				historyItemSize,
				secondColumnSplittedLines,
				{ dryRun }
			)
		}

		if (pageNumber === 1) {
			if (historyItemsForPage.firstColumn) {
				firstPageColumnsCount = firstPageColumnsCount + 1
			}

			if (historyItemsForPage.secondColumn) {
				firstPageColumnsCount = firstPageColumnsCount + 1
			}
		}

		lastY = Math.max(firstColumnLastY, secondColumnLastY)

		if (pageNumber < totalPageNumber && totalPageNumber > 1) {
			if (!dryRun) {
				if (nextPageSymbol) {
					writeNextPageSymbol(pdf, lastY + FONT_SPACING.S)
					hasSymbol = true
				}
			}
		}
	}

	return {
		y: lastY + FONT_SPACING.M,
		currentPageNumber: pageNumber,
		firstPageColumnsCount,
		hasSymbol,
	}
}
/* ************************************************************ */

/* ********************** writeSituation *********************** */

const writeSituationColumn = (
	pdf, previousY, situationItems,
	{ x, y },
	{ dryRun }={ dryRun: false }
) => {
	const newY = previousY + y

	let offset = 0
	situationItems.forEach(item => {
		const titleX = x + HORIZONTAL_TABULATION.XS
		const titleY = newY + offset
		if (!dryRun) {
			writeText(pdf, titleX, titleY, item.key, {
				size: FONT_SIZES.M,
				style: FONT_STYLES.BOLD
			})
		}
		offset = offset + FONT_SPACING.XS * (item.key.split('\n').length - 1) + FONT_SPACING.S

		item.values.forEach((value, i) => {
			const valueX = x + HORIZONTAL_TABULATION.S
			const valueY = newY + offset

			if (!dryRun) {
				writeText(pdf, valueX, valueY, value)
			}
			const spacing = (i === item.values.length-1) ? FONT_SPACING.M : FONT_SPACING.S
			offset = offset + FONT_SPACING.XS * (value.split('\n').length - 1) + spacing
		})
	})

	const lastY = newY + offset
	return lastY
}

const writeFirstSituationColumn = (
	pdf, previousY,
	{
		dvsCurrentStatusLines, gagesCurrentStatusLines, otcisCurrentStatusLines, otcisPvCurrentStatusLines,
		oveisCurrentStatusLines, ovesCurrentStatusLines, proceduresReparationControleeStatus,
		x, y
	},
	{ dryRun }={ dryRun: false }
) => {
	const	proceduresReparationControlee = proceduresReparationControleeStatus ?
		[{
			key: '- Procédure de réparation contrôlée',
			values: [
				proceduresReparationControleeStatus,
			]
		}] : []

	const	oveisCurrentStatus = oveisCurrentStatusLines ?
		[{
			key: '- Opposition véhicule économiquement irréparable',
			values: oveisCurrentStatusLines
		}] : []

	const	ovesCurrentStatus = (ovesCurrentStatusLines || !oveisCurrentStatusLines) ?
		[{
			key: '- Opposition véhicule endommagé',
			values: ovesCurrentStatusLines || ['Aucun']
		}] : []

	const situationItems = [
		{
			key: '- Opposition au transfert du certificat\n  d\'immatriculation (OTCI)',
			values:	otcisPvCurrentStatusLines[0] === 'Aucune' ? otcisCurrentStatusLines : otcisPvCurrentStatusLines,
		},
		...oveisCurrentStatus,
		...ovesCurrentStatus,
		...proceduresReparationControlee,
		{
			key: '- Déclaration valant saisie',
			values: dvsCurrentStatusLines,
		},
		{
			key: '- Gage',
			values:	gagesCurrentStatusLines
		}
	]

	return writeSituationColumn(pdf, previousY, situationItems, { x, y }, { dryRun })
}

const writeSecondSituationColumn = (
	pdf, previousY,
	{
		annulationCurrentStatus, volVehicule, volTitre, perteTitre, duplicataTitre,
		suspensionsCurrentStatusLines, x, y
	},
	{ dryRun }={ dryRun: false }
) => {
	const situationItems = [
		{
			key: '- Immatriculation suspendue',
			values: suspensionsCurrentStatusLines
		},
		{
			key: '- Immatriculation annulée',
			values: [
				annulationCurrentStatus,
			]
		},
		{
			key: '- Véhicule volé',
			values: [
				volVehicule === 'NON' ? 'Non' : 'Oui',
			]
		},
		{
			key: '- Certificat d\'immatriculation volé',
			values: [
				volTitre === 'NON' ? 'Non' : 'Oui',
			]
		},
		{
			key: '- Certificat d\'immatriculation perdu',
			values: [
				perteTitre === 'NON' ? 'Non' : 'Oui',
			]
		},
		{
			key: '- Certificat d\'immatriculation duplicata',
			values: [
				duplicataTitre === 'NON' ? 'Non' : 'Oui',
			]
		}
	]

	return writeSituationColumn(pdf, previousY, situationItems, { x, y }, { dryRun })
}

const writeSituation = (
	pdf, y,
	{
		annulationCurrentStatus,
		duplicataTitre,
		dvsCurrentStatusLines,
		gagesCurrentStatusLines,
		otcisCurrentStatusLines,
		otcisPvCurrentStatusLines,
		oveisCurrentStatusLines,
		ovesCurrentStatusLines,
		perteTitre,
		plaque,
		proceduresReparationControleeStatus,
		suspensionsCurrentStatusLines,
		volTitre,
		volVehicule
	},
	{ dryRun }={ dryRun: false }
) => {
	const spacing = FONT_SPACING.M

	if (!dryRun) {
		if (plaque) {
			writeTitle(pdf, FIRST_COLUMN_X, y, `Situation administrative du véhicule - ${plaque}`)
		} else {
			writeTitle(pdf, FIRST_COLUMN_X, y, 'Situation administrative du véhicule')
		}
	}

	const lastFirstY = writeFirstSituationColumn(
		pdf, y,
		{
			dvsCurrentStatusLines, gagesCurrentStatusLines, otcisCurrentStatusLines,
			otcisPvCurrentStatusLines, oveisCurrentStatusLines, ovesCurrentStatusLines,
			proceduresReparationControleeStatus, x: FIRST_COLUMN_X, y: spacing
		},
		{ dryRun }
	)
	const lastSecondY = writeSecondSituationColumn(
		pdf, y,
		{
			annulationCurrentStatus, duplicataTitre, perteTitre, suspensionsCurrentStatusLines,
			volTitre, volVehicule, x: SECOND_COLUMN_X, y: spacing
		},
		{ dryRun }
	)

	return Math.max(lastFirstY, lastSecondY)
}

const writeAnnulation = (pdf, y, dateAnnulation) => {
	const textY = writeText(pdf, FIRST_COLUMN_X, y, 'Le certificat demandé a été annulé.', {
		size: FONT_SIZES.L,
		style: FONT_STYLES.BOLD
	})

	return writeText(pdf, FIRST_COLUMN_X, textY + FONT_SPACING.S, `Immatriculation annulée le : ${dateAnnulation}.`, {
		size: FONT_SIZES.L,
		style: FONT_STYLES.BOLD
	})
}
/* ************************************************************ */

/* ********************** CONTENT ********************** */
export const writeContent = (
	pdf,
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
		ovesCurrentStatusLines,
		perteTitre,
		proceduresReparationControleeStatus,
		suspensionsCurrentStatusLines,
		volTitre,
		volVehicule,
	}={}
) => {
	const writeHeaderCallback = (pdf) => {
		const headerY = writeHeaderLogo(pdf, marianneImage)
		return writeCSAMainTitle(pdf, headerY + FONT_SPACING.L)
	}

	const writeFooterCallback = (
		pdf,
		{ dryRun }={ dryRun: false }
	) => {
		return writeFooter(pdf, { histoVecLogo, qrCodeUrl, validityDate, webSiteUrl }, { dryRun })
	}

	const bottomHeaderY = writeHeaderCallback(pdf)
	if (isAnnulationCI) {
		const vehicleIdentificationAnnulationY = writeVehicleIdentification(pdf, plaque, premierCertificat, vin, marque)
		const annulationY = vehicleIdentificationAnnulationY + FONT_SPACING.XL * 2
		writeAnnulation(pdf, annulationY, dateAnnulation)
		writeFooterCallback(pdf)
		writePageNumber(pdf, 1, 1)

		return
	}
	const vehicleIdentificationBottomY = writeVehicleIdentification(pdf, plaque, premierCertificat, vin, marque)

	const { topY: footerTopY } = writeFooterCallback(pdf)

	const nextPageTopY = bottomHeaderY
	const historyNextPageTopY = nextPageTopY + FONT_SIZES.S  // Adding history title dynamically for each new page

	/***** REVERSE simulation (1-SITUATION ADMINISTRATIVE, 2-HISTORY) *****/
	/*
		1- Simulate writeSituation call to :
			a - get bottom situation Y position

		2 - Simulate writeHistory :
			a - to know if history Y size will fit into one page document
				(and force one column or two columns option)

		=> we know if we need to force two columns write for history
	*/


	const simulatedSituationBottomY = writeSituation(
		pdf, vehicleIdentificationBottomY,
		{
			annulationCurrentStatus,
			duplicataTitre,
			dvsCurrentStatusLines,
			gagesCurrentStatusLines,
			otcisCurrentStatusLines,
			otcisPvCurrentStatusLines,
			oveisCurrentStatusLines,
			ovesCurrentStatusLines,
			perteTitre,
			plaque,
			proceduresReparationControleeStatus,
			suspensionsCurrentStatusLines,
			volTitre,
			volVehicule
		},
		{ dryRun: true }
	)

	// Simulate writeHistory call (using dryRun option and simulatedSituationBottomY) to :
	// 1 - know if document would fit into one page, in order to force 2 columns history or not
	const {
		firstPageColumnsCount,
		currentPageNumber: simulatedCurrentPageNumber,
		y: simulatedHistoryWithMarginBottomY,
	} = writeHistory(
		pdf, simulatedSituationBottomY, footerTopY, historyNextPageTopY,
		historyItems, plaque, writeFooterCallback, writeHeaderCallback,
		{ dryRun: true }
	)

	const forceTwoColumns = firstPageColumnsCount == 2
	const lastPageNumber = simulatedHistoryWithMarginBottomY > footerTopY ? simulatedCurrentPageNumber + 1 : simulatedCurrentPageNumber
	const isSituationSectionOnNewPage = simulatedHistoryWithMarginBottomY > footerTopY || lastPageNumber > 1
	/**********************************************************************/

	// Since we have all needed informations, let's write the pdf file for real!
	const {
		y: historyWithMarginBottomY,
		currentPageNumber,
		hasSymbol,
	} = writeHistory(
		pdf, vehicleIdentificationBottomY, footerTopY, historyNextPageTopY,
		historyItems, plaque, writeFooterCallback, writeHeaderCallback,
		{ dryRun: false, forceTwoColumns, nextPageSymbol: isSituationSectionOnNewPage },
		{ totalPageCount: lastPageNumber }
	)

	if (isSituationSectionOnNewPage && currentPageNumber < lastPageNumber) {
		if (!hasSymbol) {
			writeNextPageSymbol(pdf, historyWithMarginBottomY - FONT_SPACING.S)
		}
		addPage(pdf, writeHeaderCallback, writeFooterCallback)
		writePageNumber(pdf, lastPageNumber, lastPageNumber)
	}

	const situationTopY = (isSituationSectionOnNewPage && currentPageNumber < lastPageNumber) ? nextPageTopY : historyWithMarginBottomY

	writeSituation(
		pdf, situationTopY,
		{
			annulationCurrentStatus,
			duplicataTitre,
			dvsCurrentStatusLines,
			gagesCurrentStatusLines,
			otcisCurrentStatusLines,
			otcisPvCurrentStatusLines,
			oveisCurrentStatusLines,
			ovesCurrentStatusLines,
			perteTitre,
			plaque: isSituationSectionOnNewPage ? plaque : '',
			proceduresReparationControleeStatus,
			suspensionsCurrentStatusLines,
			volTitre,
			volVehicule
		}
	)
}
