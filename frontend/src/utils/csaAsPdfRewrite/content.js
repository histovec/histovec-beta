import { writeFooter } from './footer'

import {
	COLUMN_WIDTH,
	FONT_SIZES,
	FONT_SPACING,
	FONT_STYLES,
	BORDER_LEFT_PAGE_X,
	MIDDLE_PAGE_X,
	// NEXT_PAGE_SYMBOL_X,
	HORIZONTAL_TABULATION,
	MISSING_VALUE,
	// TO_BE_CONTINUED_SYMBOL,
	TOP_PAGE_MARGIN
} from './constants'

import {
	// getTextLinesWithSplit,
	writeMainTitle,
	writePageNumber,
	writeText,
	writeTitle,
	writeWithSpacing
} from './utils'


const SECTION_TITLE_BULLET = '-'

// const writeNextPageSymbol = ({
//   page,
//   embeddedFonts,
//   y
// }) => {
//   writeText({
// 	   page,
// 	   embeddedFonts,
// 	   x: NEXT_PAGE_SYMBOL_X,
// 	   y,
// 	   text: TO_BE_CONTINUED_SYMBOL,
// 	   size: FONT_SIZES.M,
// 	   style: FONT_STYLES.BOLD
//   })
// }


const writeHeaderLogoPng = ({
	page,
	y,
	headerLogoPng
}) => {
	const pngDims = headerLogoPng.scale(0.15)
	const pngY = y - pngDims.height

	page.drawImage(headerLogoPng, {
		x: page.getWidth() / 2 - pngDims.width / 2,
		y: pngY,
		width: pngDims.width,
		height: pngDims.height,
	})

	return pngY - FONT_SPACING.XXL
}

const writeCSAMainTitle = ({
	page,
	embeddedFonts,
	y
}) => {
	const subTitleY = writeMainTitle({
		page,
		embeddedFonts,
		x: MIDDLE_PAGE_X,
		y,
		title: 'Certificat de situation administrative détaillé'
	})

	const titleY = writeTitle({
		page,
		embeddedFonts,
		x: MIDDLE_PAGE_X,
		y: subTitleY,
		title: '(Articles L.322-2 et R.322-4 du code de la route)',
		center: true,
		style: FONT_STYLES.NORMAL
	})

	const nextY = titleY - FONT_SPACING.XXL
	return nextY
}

const writeVehicleIdentification = ({
	page,
	embeddedFonts,
	y,
	plaque,
	premierCertificat,
	vin,
	marque
}) => {
	const vehicleIdentificationInfosY = writeTitle({
		page,
		embeddedFonts,
		x: BORDER_LEFT_PAGE_X,
		y,
		title: 'Identification du véhicule'
	})

	const labels = [
		'Numéro d\'immatriculation du véhicule :',
		'Date de première immatriculation du véhicule :',
		'Numéro VIN du véhicule (ou numéro de série) :',
		'Marque :'
	]
	const leftPartY = writeWithSpacing({
		page,
		embeddedFonts,
		x: BORDER_LEFT_PAGE_X + HORIZONTAL_TABULATION.XS,
		y: vehicleIdentificationInfosY,
		textLines: labels,
		increaseLineHeightOf: 4
	})

	const values = [
		plaque.toUpperCase() || MISSING_VALUE,
		premierCertificat || MISSING_VALUE,
		vin || MISSING_VALUE,
		marque || MISSING_VALUE
	]
	const rightPartY = writeWithSpacing({
		page,
		embeddedFonts,
		x: MIDDLE_PAGE_X + HORIZONTAL_TABULATION.XS,
		y: vehicleIdentificationInfosY,
		textLines: values,
		increaseLineHeightOf: 4
	})

	const nextY = Math.min(leftPartY, rightPartY) - FONT_SPACING.XXL
	return nextY
}

/* **********************  writeHistory  ********************** */

// const getCutIndex = (itemsWithSplit, maxNbLinesToCut) => {
// 	const result = itemsWithSplit.reduce(
// 		({ linesCount, cutIndex }, { splittedContent: { length: itemLines } }, i) => {
// 			const updatedLinesCount = linesCount + itemLines

// 			return {
// 				linesCount: updatedLinesCount,
// 				cutIndex: updatedLinesCount <= maxNbLinesToCut ? i +1 : cutIndex
// 			}
// 		},
// 		{ linesCount: 0, cutIndex: 0 }
// 	)

// 	return result.cutIndex
// }

// const getBalancedTextLinesForPage = (
// 	topY, remainingHeight, maxColumnLinesForPage, itemsWithSplit,
// 	{ onlyOneColumn }={ onlyOneColumn: false }
// ) => {
// 	if (remainingHeight < 0) {
// 		throw new Error('Bad use for getBalancedTextLinesForPage...')
// 	}

// 	if (onlyOneColumn && itemsWithSplit.length > maxColumnLinesForPage) {
// 		throw new Error('Bad use for getBalancedTextLinesForPage...')
// 	}

// 	if (onlyOneColumn) {
// 		return {
// 			firstColumn: {
// 				x: BORDER_LEFT_PAGE_X + HORIZONTAL_TABULATION.XS,
// 				y: topY,
// 				items: itemsWithSplit
// 			},
// 			remainingItems: []
// 		}
// 	}

// 	const totalLines = itemsWithSplit.reduce((count, { splittedContent: { length: itemLines }}) => count + itemLines, 0)
// 	const maxLinesForPage = maxColumnLinesForPage * 2

// 	const totalLinesToWriteForPage = totalLines < maxLinesForPage ? totalLines : maxLinesForPage
// 	const remainder = totalLinesToWriteForPage % 2

// 	const getMaxLineToWriteForColumn = (itemsLength) => {
// 		if (itemsLength === 1) {
// 			return maxColumnLinesForPage
// 		}

// 		return Math.min(maxColumnLinesForPage, Math.floor(totalLinesToWriteForPage / 2) + remainder)
// 	}

// 	const firstColumnCutIndex = getCutIndex(itemsWithSplit, getMaxLineToWriteForColumn(itemsWithSplit.length))
// 	const firstColumnItems = itemsWithSplit.slice(0, firstColumnCutIndex)

// 	const itemsWithoutFirstColumn = itemsWithSplit.slice(firstColumnCutIndex)

// 	const secondColumnCutIndex = getCutIndex(itemsWithoutFirstColumn, getMaxLineToWriteForColumn(itemsWithoutFirstColumn.length))
// 	const secondColumnItems = itemsWithoutFirstColumn.slice(0, secondColumnCutIndex)

// 	const remainingItems = itemsWithoutFirstColumn.slice(secondColumnCutIndex)

// 	return {
// 		firstColumn: {
// 			x: BORDER_LEFT_PAGE_X + HORIZONTAL_TABULATION.XS,
// 			y: topY,
// 			items: firstColumnItems
// 		},
// 		secondColumn: {
// 			x: MIDDLE_PAGE_X + HORIZONTAL_TABULATION.XS,
// 			y: topY,
// 			items: secondColumnItems
// 		},
// 		remainingItems
// 	}
// }

// const getHistoryItemsByPage = (
// 	firstPageTopY, bottomY, bottomHistoryTitleForNextPage, historyItemSize, historyItems,
// 	{ forceTwoColumns } = { forceTwoColumns: false }
// ) => {
// 	let remainingHeight = bottomY - firstPageTopY
// 	let maxColumnLinesForPage = Math.floor(remainingHeight / historyItemSize)

// 	let historyItemsWithSplit, firstColumn, secondColumn, remainingItems

// 	// All lines fit in first page and one column
// 	if (historyItems.length <= maxColumnLinesForPage && !forceTwoColumns ) {
// 		historyItemsWithSplit = getTextLinesWithSplit(historyItems, { onlyOneColumn: true });
// 		({
// 			firstColumn,
// 			secondColumn,
// 			remainingItems
// 		} = getBalancedTextLinesForPage(firstPageTopY, remainingHeight, maxColumnLinesForPage, historyItemsWithSplit, { onlyOneColumn: true })
// 		)

// 	} else {  // First page with many columns
// 		historyItemsWithSplit = getTextLinesWithSplit(historyItems);
// 		({
// 			firstColumn,
// 			secondColumn,
// 			remainingItems
// 		} = getBalancedTextLinesForPage(firstPageTopY, remainingHeight, maxColumnLinesForPage, historyItemsWithSplit)
// 		)
// 	}

// 	let pageNumber = 1
// 	let historyItemsByPage = {
// 		[pageNumber]: {
// 			firstColumn,
// 			secondColumn
// 		}
// 	}

// 	while (remainingItems.length) {
// 		remainingHeight = bottomY - bottomHistoryTitleForNextPage
// 		maxColumnLinesForPage = Math.floor(remainingHeight / historyItemSize);

// 		// Always display 2 columns for next pages since first page has 2 columns
// 		({
// 			firstColumn,
// 			secondColumn,
// 			remainingItems
// 		} = getBalancedTextLinesForPage(bottomHistoryTitleForNextPage, remainingHeight, maxColumnLinesForPage, remainingItems))

// 		pageNumber = pageNumber + 1
// 		historyItemsByPage[pageNumber] = {
// 			firstColumn,
// 			secondColumn
// 		}
// 	}

// 	return historyItemsByPage
// }


const addPage = ({
	doc,
	embeddedFonts,
	writeHeaderCallback,
	writeFooterCallback,
	title = ''
}) => {
	const page = doc.addPage()
  page.setFont(embeddedFonts[FONT_STYLES.NORMAL])

	let nextY = writeHeaderCallback({ page, embeddedFonts })
	if (title) {
		nextY = writeTitle({ page, embeddedFonts, x: BORDER_LEFT_PAGE_X, y: nextY, title })
	}
	const { topFooterY, bottomFooterY } = writeFooterCallback({ page, embeddedFonts })

	return { page, nextY, topFooterY, bottomFooterY }
}

// const writeHistory = (
// 	doc, page, embeddedFonts, y, topFooterY, bottomHistoryTitleForNextPage, historyItems, plaque, writeFooterCallback, writeHeaderCallback,
// 	{ dryRun, forceTwoColumns, nextPageSymbol, totalPageCount: null }
// ) => {
//	let topY
// 	if (!dryRun) {
// 		{ y: topY } = writeTitle(page, embeddedFonts, BORDER_LEFT_PAGE_X, y, 'Historique du véhicule')
// 	}

// 	const historyItemSize = FONT_SPACING.S
// 	const historyItemsByPage = getHistoryItemsByPage(
// 		topY, topFooterY, bottomHistoryTitleForNextPage, historyItemSize, historyItems,
// 		{ forceTwoColumns }
// 	)
// 	const totalPageNumber =  totalPageCount ? totalPageCount : Object.keys(historyItemsByPage).length

// 	let firstColumnLastY = y
// 	let secondColumnLastY = y
// 	let firstPageColumnsCount = 0
// 	let lastY = y
// 	let currentPage = page
// 	let pageNumber
// 	let hasSymbol = false

// 	for (let [pageNumberStr, historyItemsForPage] of Object.entries(historyItemsByPage)) {
// 		pageNumber = parseInt(pageNumberStr)
// 		if (!dryRun) {
// 			if (pageNumber > 1) {
// 				{ page: currentPage, nextY, bottomFooterY } = addPage(doc, embeddedFonts, writeHeaderCallback, writeFooterCallback, `Suite historique du véhicule - ${plaque}`)
// 			}
// 			writePageNumber(currentPage, embeddedFonts, bottomFooterY, { pageNumber, totalPageNumber })
// 		}
// 		const firstColumnSplittedLines = historyItemsForPage.firstColumn.items.map(
// 			(item) => item.splittedContent
// 		).flat()

// 		firstColumnLastY = writeWithSpacing({
// 			page: currentPage,
//      embeddedFonts,
// 			x: historyItemsForPage.firstColumn.x,
// 			y: historyItemsForPage.firstColumn.y,
// 			textLines: firstColumnSplittedLines,
// 			size: historyItemSize,
// 			dryRun
// 		})

// 		if (historyItemsForPage.secondColumn) {
// 			const secondColumnSplittedLines = historyItemsForPage.secondColumn.items.map(
// 				(item) => item.splittedContent
// 			).flat()

// 			secondColumnLastY = writeWithSpacing({
// 				page: currentPage,
//				embeddedFonts,
// 				x: historyItemsForPage.secondColumn.x,
// 				y: historyItemsForPage.secondColumn.y,
// 				textLines: secondColumnSplittedLines,
// 				size: historyItemSize,
// 				dryRun
// 			})
// 		}

// 		if (pageNumber === 1) {
// 			if (historyItemsForPage.firstColumn) {
// 				firstPageColumnsCount = firstPageColumnsCount + 1
// 			}

// 			if (historyItemsForPage.secondColumn) {
// 				firstPageColumnsCount = firstPageColumnsCount + 1
// 			}
// 		}

// 		lastY = Math.min(firstColumnLastY, secondColumnLastY)

// 		if (pageNumber < totalPageNumber && totalPageNumber > 1) {
// 			if (!dryRun) {
// 				if (nextPageSymbol) {
// 					writeNextPageSymbol(currentPage, embeddedFonts, lastY - FONT_SPACING.S)
// 					hasSymbol = true
// 				}
// 			}
// 		}
// 	}

// 	return {
// 		y: lastY - FONT_SPACING.M,
// 		currentPage,
// 		currentPageNumber: pageNumber,
// 		firstPageColumnsCount,
// 		hasSymbol,
// 	}
// }
/* ************************************************************ */

/* ********************** writeSituation *********************** */

const writeSituationColumn = ({
	page,
	embeddedFonts,
	x,
	y,
	situationItems,
	dryRun
}) => {
	const sectionTitleX = x + HORIZONTAL_TABULATION.XS
	const valueX = x + HORIZONTAL_TABULATION.S

	let nextY = y
	situationItems.forEach(({ key: sectionTitle, values: sectionValues }) => {
		const sectionTitleBottomY = writeWithSpacing({
			page,
			embeddedFonts,
			x: sectionTitleX,
			y: nextY,
			textLines: [sectionTitle],
			increaseLineHeightOf: 2,
			maxWidth: COLUMN_WIDTH,
			size: FONT_SIZES.M,
			style: FONT_STYLES.BOLD,
			dryRun
		})

		nextY = sectionTitleBottomY - FONT_SPACING.XXS

		sectionValues.forEach((value, i) => {
			const valueBottomY = writeWithSpacing({
				page,
				embeddedFonts,
				x: valueX,
				y: nextY,
				textLines: [value],
				maxWidth: COLUMN_WIDTH,
				dryRun
			})
			const isLastLine = (i === sectionValues.length-1)
			const spacing = isLastLine ? FONT_SPACING.M : FONT_SPACING.S

			nextY = valueBottomY - spacing
		})
	})

	return nextY
}

const writeFirstSituationColumn = ({
	page,
	embeddedFonts,
	x,
	y,
	dvsCurrentStatusLines,
	gagesCurrentStatusLines,
	otcisCurrentStatusLines,
	otcisPvCurrentStatusLines,
	oveisCurrentStatusLines,
	ovesCurrentStatusLines,
	proceduresReparationControleeStatus,
	dryRun
}) => {
	const	proceduresReparationControlee = proceduresReparationControleeStatus ?
		[{
			key: `${SECTION_TITLE_BULLET} Procédure de réparation contrôlée`,
			values: [
				proceduresReparationControleeStatus,
			]
		}] : []

	const	oveisCurrentStatus = oveisCurrentStatusLines ?
		[{
			key: `${SECTION_TITLE_BULLET} Opposition véhicule économiquement irréparable`,
			values: oveisCurrentStatusLines
		}] : []

	const	ovesCurrentStatus = (ovesCurrentStatusLines || !oveisCurrentStatusLines) ?
		[{
			key: `${SECTION_TITLE_BULLET} Opposition véhicule endommagé`,
			values: ovesCurrentStatusLines || ['Aucun']
		}] : []

	const situationItems = [
		{
			key: `${SECTION_TITLE_BULLET} Opposition au transfert du certificat\n  d'immatriculation (OTCI)`,
			values:	otcisPvCurrentStatusLines[0] === 'Aucune' ? otcisCurrentStatusLines : otcisPvCurrentStatusLines,
		},
		...oveisCurrentStatus,
		...ovesCurrentStatus,
		...proceduresReparationControlee,
		{
			key: `${SECTION_TITLE_BULLET} Déclaration valant saisie`,
			values: dvsCurrentStatusLines,
		},
		{
			key: `${SECTION_TITLE_BULLET} Gage`,
			values:	gagesCurrentStatusLines
		}
	]

	return writeSituationColumn({ page, embeddedFonts, x, y, situationItems, dryRun })
}

const writeSecondSituationColumn = ({
	page,
	embeddedFonts,
	x,
	y,
	annulationCurrentStatus,
	volVehicule,
	volTitre,
	perteTitre,
	duplicataTitre,
	suspensionsCurrentStatusLines,
	dryRun
}) => {
	const situationItems = [
		{
			key: `${SECTION_TITLE_BULLET} Immatriculation suspendue`,
			values: suspensionsCurrentStatusLines
		},
		{
			key: `${SECTION_TITLE_BULLET} Immatriculation annulée`,
			values: [
				annulationCurrentStatus,
			]
		},
		{
			key: `${SECTION_TITLE_BULLET} Véhicule volé`,
			values: [
				volVehicule === 'NON' ? 'Non' : 'Oui',
			]
		},
		{
			key: `${SECTION_TITLE_BULLET} Certificat d'immatriculation volé`,
			values: [
				volTitre === 'NON' ? 'Non' : 'Oui',
			]
		},
		{
			key: `${SECTION_TITLE_BULLET} Certificat d'immatriculation perdu`,
			values: [
				perteTitre === 'NON' ? 'Non' : 'Oui',
			]
		},
		{
			key: `${SECTION_TITLE_BULLET} Certificat d'immatriculation duplicata`,
			values: [
				duplicataTitre === 'NON' ? 'Non' : 'Oui',
			]
		}
	]

	return writeSituationColumn({ page, embeddedFonts, x, y, situationItems, dryRun })
}

const writeSituation = ({
	page,
	embeddedFonts,
	y,
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
	volVehicule,
	dryRun
}) => {
	const title = plaque ? `Situation administrative du véhicule - ${plaque}` : 'Situation administrative du véhicule'
	const situationY = writeTitle({
		page,
		embeddedFonts,
		x: BORDER_LEFT_PAGE_X,
		y,
		title,
		dryRun
	})

	const firstSituationColumnBottomY = writeFirstSituationColumn({
		page,
		embeddedFonts,
		x: BORDER_LEFT_PAGE_X,
		y: situationY,
		dvsCurrentStatusLines,
		gagesCurrentStatusLines,
		otcisCurrentStatusLines,
		otcisPvCurrentStatusLines,
		oveisCurrentStatusLines,
		ovesCurrentStatusLines,
		proceduresReparationControleeStatus,
		dryRun
	})

	const secondSituationColumnBottomY = writeSecondSituationColumn({
		page,
		embeddedFonts,
		x: MIDDLE_PAGE_X,
		y: situationY,
		annulationCurrentStatus,
		duplicataTitre,
		perteTitre,
		suspensionsCurrentStatusLines,
		volTitre,
		volVehicule,
		dryRun
	})

	return Math.min(firstSituationColumnBottomY, secondSituationColumnBottomY)
}

const writeAnnulation = ({
	page,
	embeddedFonts,
	y,
	dateAnnulation
}) => {
	const textY = writeText({
		page,
		embeddedFonts,
		x: BORDER_LEFT_PAGE_X,
		y,
		text: 'Le certificat demandé a été annulé.',
		size: FONT_SIZES.L,
		style: FONT_STYLES.BOLD
	})

	return writeText({
		page,
		embeddedFonts,
		x: BORDER_LEFT_PAGE_X,
		y: textY - FONT_SPACING.S,
		text: `Immatriculation annulée le : ${dateAnnulation}.`,
		size: FONT_SIZES.L,
		style: FONT_STYLES.BOLD
	})
}
/* ************************************************************ */

/* ********************** CONTENT ********************** */
export const writeContent = (
	// Complete CSA and annulation
	{
		doc,
		embeddedFonts,
		embeddedLogos: { headerLogoPng, footerLogoPng },
		isAnnulationCI,
		annulationCurrentStatus,
		dateAnnulation,
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
		// historyItems,
		otcisCurrentStatusLines,
		otcisPvCurrentStatusLines,
		oveisCurrentStatusLines,
		ovesCurrentStatusLines,
		perteTitre,
		proceduresReparationControleeStatus,
		suspensionsCurrentStatusLines,
		volTitre,
		volVehicule,
	} = {}
) => {
	const writeHeaderCallback = ({ page, embeddedFonts }) => {
		const { height } = page.getSize()
		const topPageY = height - TOP_PAGE_MARGIN

		const afterHeaderY = writeHeaderLogoPng({ page, y: topPageY, headerLogoPng })
		const csaMainTitleY = writeCSAMainTitle({ page, embeddedFonts, y: afterHeaderY })

		return csaMainTitleY
	}

	const writeFooterCallback = ({ page, embeddedFonts }) => {
    return writeFooter({ page, embeddedFonts, footerLogoPng, qrCodeUrl, validityDate, webSiteUrl })
	}

	const {
		page,
		nextY: vehicleIdentificationY,
		// topFooterY,
		bottomFooterY
	} = addPage({ doc, embeddedFonts, writeHeaderCallback, writeFooterCallback })

	const vehicleIdentificationBottomY = writeVehicleIdentification({
		page,
		embeddedFonts,
		y: vehicleIdentificationY,
		plaque,
		premierCertificat,
		vin,
		marque
	})

	if (isAnnulationCI) {
		const annulationY = vehicleIdentificationBottomY // - FONT_SPACING.XL
		writeAnnulation({ page, embeddedFonts, annulationY, dateAnnulation })
		writePageNumber({ page, embeddedFonts, bottomFooterY, pageNumber: 1, totalPageNumber: 1 })

		return
	}


	// const nextPageTopY = bottomHeaderY
	// const historyNextPageTopY = nextPageTopY - FONT_SIZES.S  // Adding history title dynamically for each new page

	/***** REVERSE simulation (1-SITUATION ADMINISTRATIVE, 2-HISTORY) *****/
	/*
		1- Simulate writeSituation call to :
			a - get bottom situation Y position (Situation always fit into the first page if written first)

		2 - Simulate writeHistory :
			a - to know if history Y size will fit into one page document
				(and force one column or two columns option)

		=> we know if we need to force two columns write for history
	*/


	// const simulatedSituationBottomY =
	writeSituation({
		page,
		embeddedFonts,
		y: vehicleIdentificationBottomY,
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
		volVehicule,
		dryRun: true
	})

	// Simulate writeHistory call (using dryRun option and simulatedSituationBottomY) to :
	// 1 - know if document would fit into one page, in order to force 2 columns history or not
	// const {
	// 	firstPageColumnsCount,
	// 	currentPageNumber: simulatedCurrentPageNumber,
	// 	y: simulatedHistoryWithMarginBottomY,
	// } = writeHistory(
	// 	doc, page, embeddedFonts, simulatedSituationBottomY, footerTopY, historyNextPageTopY,
	// 	historyItems, plaque, writeFooterCallback, writeHeaderCallback,
	// 	{ dryRun: true }
	// )

	// const forceTwoColumns = firstPageColumnsCount == 2
	// const lastPageNumber = simulatedHistoryWithMarginBottomY > footerTopY ? simulatedCurrentPageNumber + 1 : simulatedCurrentPageNumber
	// const isSituationSectionOnNewPage = simulatedHistoryWithMarginBottomY > footerTopY || lastPageNumber > 1
	// /**********************************************************************/

	// // All non simulated previous operations (writeHeaderCallback, writeVehicleIdentification, writeFooterCallback) always fit into first page
	// // intial page argument is sufficient for these operations
	// let currentPage = page

	// // Since we have all needed informations, let's write the pdf file for real!
	// const {
	// 	y: historyWithMarginBottomY,
	// 	currentPage: lastHistoryPage,
	// 	currentPageNumber,
	// 	hasSymbol
	// } = writeHistory(
	// 	doc, page, embeddedFonts, vehicleIdentificationBottomY, footerTopY, historyNextPageTopY,
	// 	historyItems, plaque, writeFooterCallback, writeHeaderCallback,
	// 	{ forceTwoColumns, nextPageSymbol: isSituationSectionOnNewPage, totalPageCount: lastPageNumber }
	// )

	// currentPage = lastHistoryPage

	// if (isSituationSectionOnNewPage && currentPageNumber < lastPageNumber) {
	// 	if (!hasSymbol) {
	// 		writeNextPageSymbol(currentPage, embeddedFonts, historyWithMarginBottomY - FONT_SPACING.S)
	// 	}
	// 	{ page: currentPage, nextY, bottomFooterY } = addPage(doc, embeddedFonts, writeHeaderCallback, writeFooterCallback)
	// 	writePageNumber(currentPage, embeddedFonts, bottomFooterY, { pageNumber: lastPageNumber, totalPageNumber: lastPageNumber })
	// }

	// const situationTopY = (isSituationSectionOnNewPage && currentPageNumber < lastPageNumber) ? nextPageTopY : historyWithMarginBottomY

	// // Situation will always be written in a single page, by construction
	// writeSituation({
	// 	 page: currentPage,
	//   embeddedFonts,
	//   y: situationTopY,
	// 	 annulationCurrentStatus,
	// 	 duplicataTitre,
	// 	 dvsCurrentStatusLines,
	// 	 gagesCurrentStatusLines,
	// 	 otcisCurrentStatusLines,
	// 	 otcisPvCurrentStatusLines,
	// 	 oveisCurrentStatusLines,
	// 	 ovesCurrentStatusLines,
	// 	 perteTitre,
	// 	 plaque: isSituationSectionOnNewPage ? plaque : '',
	// 	 proceduresReparationControleeStatus,
	// 	 suspensionsCurrentStatusLines,
	// 	 volTitre,
	// 	 volVehicule
	// })
}
