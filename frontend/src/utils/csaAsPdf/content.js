import { writeFooter } from './footer.js'
import { formatIsoToFrDate, formatIsoToFrDateOrDefault } from '@/assets/js/format.js'

import {
	COLUMN_WIDTH,
	LARGE_COLUMN_WIDTH,
	FONT_SIZES,
	FONT_SPACING,
	FONT_STYLES,
	BORDER_LEFT_PAGE_X,
	MIDDLE_PAGE_X,
	NEXT_PAGE_SYMBOL_X,
	MULTILINES_MARGIN,
	HORIZONTAL_TABULATION,
	MISSING_VALUE,
	TO_BE_CONTINUED_SYMBOL,
	TOP_PAGE_MARGIN
} from './constants.js'

import {
	getEmbeddedFont,
	writeMainTitle,
	writePageNumber,
	writeText,
	writeTitle,
	writeWithSpacing
} from './utils.js'


const SECTION_TITLE_BULLET = '-'

const writeNextPageSymbol = ({
  page,
  embeddedFonts,
	y,
	dryRun
}) => {
  return writeText({
		page,
		embeddedFonts,
		x: NEXT_PAGE_SYMBOL_X,
		y,
		text: TO_BE_CONTINUED_SYMBOL,
		size: FONT_SIZES.M,
		style: FONT_STYLES.BOLD,
		dryRun
  })
}

const writeHeaderLogoPng = ({
	page,
	y,
	headerLogoPng
}) => {
	const pngDims = headerLogoPng.scale(0.45)
	const pngY = y - pngDims.height

	page.drawImage(headerLogoPng, {
		x: page.getWidth() / 2 - pngDims.width / 2,
		y: pngY,
		width: pngDims.width,
		height: pngDims.height,
	})

	return pngY - FONT_SPACING.XL
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
		increaseLineHeightOf: MULTILINES_MARGIN
	})

	const values = [
		plaque.toUpperCase() || MISSING_VALUE,
		formatIsoToFrDateOrDefault(premierCertificat),
		vin || MISSING_VALUE,
		marque || MISSING_VALUE
	]
	const rightPartY = writeWithSpacing({
		page,
		embeddedFonts,
		x: MIDDLE_PAGE_X + HORIZONTAL_TABULATION.XS,
		y: vehicleIdentificationInfosY,
		textLines: values,
		increaseLineHeightOf: MULTILINES_MARGIN
	})

	const nextY = Math.min(leftPartY, rightPartY) - FONT_SPACING.XXL
	return nextY
}

/* **********************  writeHistory  ********************** */

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

const getWeightedLines = (lines, embeddedFont, size, maxColumnWidth) => {
	const getTextWidth = (text) => embeddedFont.widthOfTextAtSize(text, size)
	const weightedLines = lines.map((line) => {
		const textWidth = getTextWidth(line)
		const weight = Math.ceil(textWidth / maxColumnWidth)

		return {
			line,
			weight
		}
	})

	weightedLines.forEach(function (weightedLine, i) {
		const previousTotalWeight = (i === 0) ? 0 : this[i-1].totalWeight

		this[i].totalWeight = previousTotalWeight + weightedLine.weight
	}, weightedLines)

	return weightedLines
}

const getNextColumnIndex = (weigthedLines, maxColumnLinesForPage) => {
	return weigthedLines.findIndex((weightedLine) => {
		return weightedLine.totalWeight > maxColumnLinesForPage
	})
}

const getNextColumns = (weightedLines, maxColumnLinesForPage, isFirstPage) => {
	let remainingWeightedLines
	const totalWeight = weightedLines[weightedLines.length-1].totalWeight
	const secondColumnBeginIndex = getNextColumnIndex(weightedLines, maxColumnLinesForPage)

	if (secondColumnBeginIndex < 0) {  // Only one column
		if (isFirstPage) {  // Only one column for first page
			return {
				firstColumnItems: getLinesAndTotalWeigth(weightedLines),
				secondColumnItems: { lines: [], totalWeight: 0 },
				remainingItems: { lines: [], totalWeight: 0 }
			}
		}

		// Two balanced columns for last page
		const secondColumnIndex = getNextColumnIndex(weightedLines, Math.ceil(totalWeight / 2))
		const firstColumnItems = getLinesAndTotalWeigth(weightedLines, secondColumnIndex)
		remainingWeightedLines = weightedLines.slice(secondColumnIndex)
		const secondColumnItems = getLinesAndTotalWeigth(remainingWeightedLines)

		return {
			firstColumnItems,
			secondColumnItems,
			remainingItems: { lines: [], totalWeight: 0 }
		}
	}

	// Two balanced columns for next page (not the last page)

	// Columns are not full : there are no remaining items
	if (totalWeight <= maxColumnLinesForPage * 2) {
		const secondColumnIndex = getNextColumnIndex(weightedLines, Math.ceil(totalWeight / 2))
		const firstColumnItems = getLinesAndTotalWeigth(weightedLines, secondColumnIndex)
		remainingWeightedLines = weightedLines.slice(secondColumnIndex)
		const secondColumnItems = getLinesAndTotalWeigth(remainingWeightedLines)

		return {
			firstColumnItems,
			secondColumnItems,
			remainingItems: { lines: [], totalWeight: 0 }
		}
	}

	// Columns are full : thera are remaining items
	const firstColumnItems = getLinesAndTotalWeigth(weightedLines, secondColumnBeginIndex)
	remainingWeightedLines = weightedLines.slice(secondColumnBeginIndex)

	const nextPageFirstColumnIndex = getNextColumnIndex(remainingWeightedLines, maxColumnLinesForPage * 2)
	const secondColumnItems = getLinesAndTotalWeigth(remainingWeightedLines, nextPageFirstColumnIndex)
	remainingWeightedLines = remainingWeightedLines.slice(nextPageFirstColumnIndex)

	return {
		firstColumnItems,
		secondColumnItems,
		remainingItems: getLinesAndTotalWeigth(remainingWeightedLines)
	}
}

const getLinesAndTotalWeigth = (weightedLines, i) => {
	const slicedWeightedLines = i ? weightedLines.slice(0, i) : weightedLines

	return {
		lines: slicedWeightedLines.map((weightedLine) => weightedLine.line),
		totalWeight: slicedWeightedLines[slicedWeightedLines.length-1].totalWeight
	}
}

const writeHistory = ({
	doc,
	page,
	embeddedFonts,
	y,
	topFooterY,
	bottomHeaderY,
	historyItems,
	plaque,
	writeFooterCallback,
	writeHeaderCallback,
	dryRun,
	forceTwoColumns,
	nextPageSymbol
}) => {
	const topY = writeTitle({
		page,
		embeddedFonts,
		x: BORDER_LEFT_PAGE_X,
		y,
		title: 'Historique du véhicule',
		dryRun
	})

	const style = FONT_STYLES.NORMAL
	const historyItemSize = FONT_SIZES.M
	const historyItemHeight = historyItemSize + MULTILINES_MARGIN

	let remainingHeight = topY - (topFooterY + FONT_SPACING.L)
	let maxColumnLinesForPage = Math.floor(remainingHeight / historyItemHeight)

	let firstColumnLastY = topY
	let secondColumnLastY = topY
	let lastY = topY

	let firstPageColumnsCount = historyItems.length ? 1 : 0
	let currentPage = page

	let pageNumber = 1
	let doesLastPageHasSymbol = false

	// All lines fit in first page and one column
	if (historyItems.length <= maxColumnLinesForPage && !forceTwoColumns ) {
		lastY = writeWithSpacing({
			page: currentPage,
			embeddedFonts,
			x: BORDER_LEFT_PAGE_X + HORIZONTAL_TABULATION.XS,
			y: topY,
			textLines: historyItems,
			increaseLineHeightOf: MULTILINES_MARGIN,
			maxWidth: LARGE_COLUMN_WIDTH,
			size: historyItemSize,
			dryRun
		})

		return {
			y: lastY - FONT_SPACING.XXL,
			currentPage,
			currentPageNumber: pageNumber,
			forceTwoColumns: firstPageColumnsCount === 2,
			doesLastPageHasSymbol,
		}
	}

	const embeddedFont = getEmbeddedFont({ style, embeddedFonts })
	const weightedLines = getWeightedLines(historyItems, embeddedFont, historyItemSize, COLUMN_WIDTH)
	let {
		firstColumnItems: { lines: firstColumnLines, totalWeight: firstColumnTotalWeight },
		secondColumnItems: { lines: secondColumnLines, totalWeight: secondColumnTotalWeight },
		remainingItems: { lines: remainingItems }
	} = getNextColumns(weightedLines, maxColumnLinesForPage, true)

	let remainingWeightedLines = getWeightedLines(remainingItems, embeddedFont, historyItemSize, COLUMN_WIDTH)

	firstPageColumnsCount = firstColumnLines.length && secondColumnLines.length ? 2 : firstPageColumnsCount

	if (firstColumnLines.length) {
		firstColumnLastY = writeWithSpacing({
			page: currentPage,
			embeddedFonts,
			x: BORDER_LEFT_PAGE_X + HORIZONTAL_TABULATION.XS,
			y: topY,
			textLines: firstColumnLines,
			increaseLineHeightOf: MULTILINES_MARGIN,
			maxWidth: COLUMN_WIDTH,
			size: historyItemSize,
			dryRun
		})
	}

	if (secondColumnLines.length) {
		secondColumnLastY = writeWithSpacing({
			page: currentPage,
			embeddedFonts,
			x: MIDDLE_PAGE_X + HORIZONTAL_TABULATION.XS,
			y: topY,
			textLines: secondColumnLines,
			increaseLineHeightOf: MULTILINES_MARGIN,
			maxWidth: COLUMN_WIDTH,
			size: historyItemSize,
			dryRun
		})
	}

	lastY = Math.min(firstColumnLastY, secondColumnLastY)

	let isTheLastPage = remainingWeightedLines.length === 0
	if (!isTheLastPage) {
		if (nextPageSymbol) {
			writeNextPageSymbol({
				page: currentPage,
				embeddedFonts,
				y: lastY + FONT_SPACING.S,
				dryRun
			})
			doesLastPageHasSymbol = !remainingWeightedLines.length
		}
	}

	const repeatedHistoryTitle = `Suite historique du véhicule - ${plaque}`
	const simulatedBottomTitleY = writeTitle({
		page: currentPage,
		embeddedFonts,
		x: BORDER_LEFT_PAGE_X,
		y: bottomHeaderY,
		repeatedHistoryTitle,
		dryRun: true
	})

	// Always display 2 columns for next pages since first page has 2 columns
	while (remainingWeightedLines.length) {
		if (!dryRun) {
			({ page: currentPage } = addPage({
				doc,
				embeddedFonts,
				writeHeaderCallback,
				writeFooterCallback,
				title: repeatedHistoryTitle
				}))
		}

		remainingHeight = simulatedBottomTitleY - topFooterY
		maxColumnLinesForPage = Math.floor(remainingHeight / historyItemHeight);

		({
			firstColumnItems: { lines: firstColumnLines, totalWeight: firstColumnTotalWeight },
			secondColumnItems: { lines: secondColumnLines, totalWeight: secondColumnTotalWeight },
			remainingItems: { lines: remainingItems }
		} = getNextColumns(remainingWeightedLines, maxColumnLinesForPage))

		if (firstColumnLines.length) {
			firstColumnLastY = writeWithSpacing({
				page: currentPage,
				embeddedFonts,
				x: BORDER_LEFT_PAGE_X + HORIZONTAL_TABULATION.XS,
				y: simulatedBottomTitleY,
				textLines: firstColumnLines,
				increaseLineHeightOf: MULTILINES_MARGIN,
				maxWidth: COLUMN_WIDTH,
				size: historyItemSize,
				dryRun
			})
		}

		if (secondColumnLines.length) {
			secondColumnLastY = writeWithSpacing({
				page: currentPage,
				embeddedFonts,
				x: MIDDLE_PAGE_X + HORIZONTAL_TABULATION.XS,
				y: simulatedBottomTitleY,
				textLines: secondColumnLines,
				increaseLineHeightOf: MULTILINES_MARGIN,
				maxWidth: COLUMN_WIDTH,
				size: historyItemSize,
				dryRun
			})
		}

		lastY = Math.min(firstColumnLastY, secondColumnLastY)

		remainingWeightedLines = getWeightedLines(remainingItems, embeddedFont, historyItemSize, COLUMN_WIDTH)

		isTheLastPage = remainingWeightedLines.length === 0
		if (!isTheLastPage) {
			if (nextPageSymbol) {
				writeNextPageSymbol({
					page: currentPage,
					embeddedFonts,
					y: lastY + FONT_SPACING.S,
					dryRun
				})
				doesLastPageHasSymbol = true
			}
		}

		pageNumber = pageNumber + 1
	}

	const margin = firstColumnTotalWeight === maxColumnLinesForPage || secondColumnTotalWeight === maxColumnLinesForPage ? FONT_SPACING.M : FONT_SPACING.XXL

	return {
		y: lastY - margin,
		currentPage,
		currentPageNumber: pageNumber,
		forceTwoColumns: firstPageColumnsCount === 2,
		doesLastPageHasSymbol,
	}
}
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
	otcisPVCurrentStatusLines,
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
			values: ovesCurrentStatusLines || ['Aucune']
		}] : []

	const situationItems = [
		{
			key: `${SECTION_TITLE_BULLET} Opposition au transfert du certificat\n  d'immatriculation (OTCI)`,
			values:	otcisPVCurrentStatusLines[0] === 'Aucune' ? otcisCurrentStatusLines : otcisPVCurrentStatusLines,
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
	duplicataTitre,
	perteTitre,
	volTitre,
	volVehicule,
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
				volVehicule,
			]
		},
		{
			key: `${SECTION_TITLE_BULLET} Certificat d'immatriculation volé`,
			values: [
				volTitre,
			]
		},
		{
			key: `${SECTION_TITLE_BULLET} Certificat d'immatriculation perdu`,
			values: [
				perteTitre,
			]
		},
		{
			key: `${SECTION_TITLE_BULLET} Certificat d'immatriculation duplicata`,
			values: [
				duplicataTitre,
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
	otcisPVCurrentStatusLines,
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
		otcisPVCurrentStatusLines,
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
	dateAnnulationCI
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
		text: `Immatriculation annulée le : ${formatIsoToFrDate(dateAnnulationCI)}.`,
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
    return writeFooter({ page, embeddedFonts, dateDonnees, footerLogoPng, qrCodeUrl, validityDate, webSiteUrl })
	}

	const {
		page,
		nextY: bottomHeaderY,
		topFooterY,
		bottomFooterY
	} = addPage({ doc, embeddedFonts, writeHeaderCallback, writeFooterCallback })

	const vehicleIdentificationBottomY = writeVehicleIdentification({
		page,
		embeddedFonts,
		y: bottomHeaderY,
		plaque,
		premierCertificat,
		vin,
		marque
	})

	if (isCIAnnule) {
		const annulationY = vehicleIdentificationBottomY
		writeAnnulation({ page, embeddedFonts, y: annulationY, dateAnnulationCI })
		writePageNumber({ page, embeddedFonts, y: bottomFooterY, pageNumber: 1, totalPageNumber: 1 })

		return
	}


	/***** REVERSE simulation (1-SITUATION ADMINISTRATIVE, 2-HISTORY) *****/
	/*
		1- Simulate writeSituation call to :
			a - get bottom situation Y position (Situation always fit into the first page if written first)

		2 - Simulate writeHistory :
			a - to know if history Y size will fit into one page document
				(and force one column or two columns option)

		=> we know if we need to force two columns write for history
	*/
	const simulatedSituationBottomY = writeSituation({
		page,
		embeddedFonts,
		y: vehicleIdentificationBottomY,
		annulationCurrentStatus,
		duplicataTitre,
		dvsCurrentStatusLines,
		gagesCurrentStatusLines,
		otcisCurrentStatusLines,
		otcisPVCurrentStatusLines,
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
	const {
		forceTwoColumns,
		currentPageNumber: lastPageNumber,
	} = writeHistory({
		doc,
		page,
		embeddedFonts,
		y: simulatedSituationBottomY,
		topFooterY,
		bottomHeaderY,
		historyItems,
		plaque,
		writeFooterCallback,
		writeHeaderCallback,
		dryRun: true
	})

	const situationHeight = vehicleIdentificationBottomY - simulatedSituationBottomY + FONT_SPACING.L
	const isSituationSectionOnNewPage = lastPageNumber > 1

	/**********************************************************************/

	// All non simulated previous operations (writeHeaderCallback, writeVehicleIdentification, writeFooterCallback) always fit into first page
	// intial page argument is sufficient for these operations
	let currentPage = page
	const topBottomY = !isSituationSectionOnNewPage ? topFooterY + situationHeight : topFooterY

	// // Since we have all needed informations, let's write the pdf file for real!
	const {
		y: historyWithMarginBottomY,
		currentPage: lastHistoryPage,
		currentPageNumber,
		doesLastPageHasSymbol
	} = writeHistory({
		doc,
		page,
		embeddedFonts,
		y: vehicleIdentificationBottomY,
		topFooterY: topBottomY,
		bottomHeaderY,
		historyItems,
		plaque,
		writeFooterCallback,
		writeHeaderCallback,
		forceTwoColumns,
		nextPageSymbol: isSituationSectionOnNewPage
	})

	currentPage = lastHistoryPage

	const needToAddSituationPage = isSituationSectionOnNewPage && currentPageNumber < lastPageNumber
	let situationTopY = historyWithMarginBottomY

	if (needToAddSituationPage) {
		if (!doesLastPageHasSymbol) {
			writeNextPageSymbol({ page: currentPage, embeddedFonts, y: historyWithMarginBottomY + FONT_SPACING.S })
		}
		({ page: currentPage, nextY: situationTopY } = addPage({
			doc,
			embeddedFonts,
			writeHeaderCallback,
			writeFooterCallback
		}))
	}

	// Situation will always be written in a single page, by construction
	writeSituation({
		page: currentPage,
		embeddedFonts,
		y: situationTopY,
		annulationCurrentStatus,
		duplicataTitre,
		dvsCurrentStatusLines,
		gagesCurrentStatusLines,
		otcisCurrentStatusLines,
		otcisPVCurrentStatusLines,
		oveisCurrentStatusLines,
		ovesCurrentStatusLines,
		perteTitre,
		plaque: isSituationSectionOnNewPage ? plaque : '',
		proceduresReparationControleeStatus,
		suspensionsCurrentStatusLines,
		volTitre,
		volVehicule
	})

	// Write all page number
	const totalPageNumber = doc.getPageCount()
	for(let i=0; i<totalPageNumber; i++) {
		const page = doc.getPage(i)

		writePageNumber({
			page,
			embeddedFonts,
			y: bottomFooterY,
			pageNumber: i+1,
			totalPageNumber
		})
	}
}
