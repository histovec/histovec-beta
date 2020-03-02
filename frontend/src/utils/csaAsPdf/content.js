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


const writeHeaderLogo = (
	pdf, image,
	{ imageFormat, width, height,	x}={
		imageFormat: IMAGE_FORMAT.PNG,
		width: 46,
		height: 24,
		x: 82,
	}
) => {
	pdf.addImage(image, imageFormat, x, TOP_PAGE_Y, width, height)
	return TOP_PAGE_Y + height + FONT_SPACING.L
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
	{ y }={ y: 67 }
) => {
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

	return lastY + FONT_SPACING.L
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
	pdf, y, topFooterY, bottomHistoryTitleForNextPage, historyItems, writeFooterCallback, writeHeaderCallback,
	{ dryRun, forceTwoColumns, nextPageSymbol }={ dryRun: false, forceTwoColumns: false, nextPageSymbol: false },
	{ totalPageCount }={ totalPageCount: null }
) => {
	if (!dryRun) {
		writeTitle(pdf, FIRST_COLUMN_X, y, 'Historique du véhicule')
	}
	const topY = y + FONT_SPACING.L
	const historyItemSize = FONT_SPACING.S
	const historyItemsByPage = getHistoryItemsByPage(
		pdf, topY, topFooterY, bottomHistoryTitleForNextPage, historyItemSize, historyItems,
		{ forceTwoColumns }
	)
	const totalPageNumber = Object.keys(historyItemsByPage).length

	let firstColumnLastY = y
	let secondColumnLastY = y
	let firstPageColumnsCount = 0

	for (let [pageNumberStr, historyItemsForPage] of Object.entries(historyItemsByPage)) {
		const pageNumber = parseInt(pageNumberStr)
		if (!dryRun) {
			if (pageNumber > 1) {
				addPage(pdf, writeHeaderCallback, writeFooterCallback, 'Historique du véhicule (suite)')
			}
			writePageNumber(pdf, pageNumber, totalPageCount ? totalPageCount : totalPageNumber)
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
	}

	const lastY = Math.max(firstColumnLastY, secondColumnLastY)

	if (!dryRun) {
		if (nextPageSymbol) {
			writeText(pdf, NEXT_PAGE_SYMBOL_X, lastY + FONT_SPACING.S, '... / ...',
			{
				size: FONT_SIZES.M,
				style: FONT_STYLES.BOLD
			})
		}
	}

	return {
		y: lastY + FONT_SPACING.L,
		currentPageNumber: totalPageNumber,
		firstPageColumnsCount
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
		offset = offset + FONT_SPACING.XS * (item.key.split('\n').length - 1) + FONT_SPACING.XS

		item.values.forEach((value, i) => {
			const valueX = x + HORIZONTAL_TABULATION.S
			const valueY = newY + offset

			if (!dryRun) {
				writeText(pdf, valueX, valueY, value)
			}
			const spacing = (i === item.values.length-1) ? FONT_SPACING.M : FONT_SPACING.XS
			offset = offset + FONT_SPACING.XS * (value.split('\n').length - 1) + spacing
		})
	})

	const lastY = newY + offset
	return lastY
}

const writeFirstSituationColumn = (
	pdf, previousY,
	{ otci, pv, ove, hasPVE, saisie, gage, x, y },
	{ dryRun }={ dryRun: false }
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
				ove !== 'Aucune' ? 'Oui' : (hasPVE ? 'Oui' : 'Aucune')
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

	return writeSituationColumn(pdf, previousY, situationItems, { x, y }, { dryRun })
}

const writeSecondSituationColumn = (
	pdf, previousY,
	{ annulation, volVehicule, volTitre, perteTitre, duplicataTitre, suspension, suspensions, x, y },
	{ dryRun }={ dryRun: false }
) => {
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

	return writeSituationColumn(pdf, previousY, situationItems, { x, y }, { dryRun })
}

const writeSituation = (
	pdf, y,
	{
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
	{ dryRun }={ dryRun: false }
) => {
	const spacing = FONT_SPACING.L

	if (!dryRun) {
		writeTitle(pdf, FIRST_COLUMN_X, y, 'Situation administrative du véhicule')
	}

	const lastFirstY = writeFirstSituationColumn(
		pdf, y,
		{ gage, hasPVE, otci, ove, pv, saisie, x: FIRST_COLUMN_X, y: spacing },
		{ dryRun }
	)
	const lastSecondY = writeSecondSituationColumn(
		pdf, y,
		{ annulation, duplicataTitre, perteTitre, suspension, suspensions, volTitre, volVehicule, x: SECOND_COLUMN_X, y: spacing },
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
	if (annulation === 'Oui') {
		const vehicleIdentificationAnnulationY = writeVehicleIdentification(pdf, plaque, premierCertificat, vin, marque)
		const annulationY = vehicleIdentificationAnnulationY + FONT_SPACING.XL * 2
		writeAnnulation(pdf, annulationY, dateAnnulation)
		writeFooterCallback(pdf)
		writePageNumber(pdf, 1, 1)

		return
	}
	const vehicleIdentificationY = writeVehicleIdentification(pdf, plaque, premierCertificat, vin, marque)
	const historyTopY = vehicleIdentificationY + FONT_SPACING.S

	const { topY: footerTopY } = writeFooterCallback(pdf)
	const footerWithMarginTopY = footerTopY - FONT_SPACING.S

	const nextPageTopY = bottomHeaderY
	const historyNextPageTopY = nextPageTopY + FONT_SIZES.S  // Adding history title dynamically for each new page

	// Simulate writeSituation call (using dryRun option) to :
	// 1 - get bottom situation Y position : to know if history Y size will fit into one page document
	const simulatedSituationBottomY = writeSituation(pdf, historyTopY, {
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
	}, { dryRun: true })

	// Simulate writeHistory call (using dryRun option and simulatedSituationBottomY) to :
	// 1 - know if document would fit into one page, in order to force 2 columns history or not
	const {
		firstPageColumnsCount
	} = writeHistory(
		pdf, simulatedSituationBottomY, footerWithMarginTopY, historyNextPageTopY, historyItems, writeFooterCallback, writeHeaderCallback,
		{ dryRun: true }
	)

	let forceTwoColumns = firstPageColumnsCount == 2

	// Simulate writeHistory call (using dryRun option and simulatedSituationBottomY) to :
	// 1 - know if document would fit into one page, in order to force 2 columns history or not
	let firstPageColumnsCountSecond
	if (!forceTwoColumns) {
		({
			firstPageColumnsCount: firstPageColumnsCountSecond
		} = firstPageColumnsCountSecond = writeHistory(
			pdf, simulatedSituationBottomY, footerWithMarginTopY, historyNextPageTopY, historyItems, writeFooterCallback, writeHeaderCallback,
			{ dryRun: true, forceTwoColumns: true }
		))

		forceTwoColumns = firstPageColumnsCountSecond == 2
	}

	// Simulate writeHistory call (using dryRun option) to :
	// 1 - get bottom history Y position : to know from where we begin to write Situation section (and to compute point 2)
	// 2 - get history page count : to calculate Situation section position (does it fit in current page or do we write it on the next page?)
	const {
		y: simulatedHistoryY,
		currentPageNumber: simulatedCurrentPageNumber
	} = writeHistory(
		pdf, historyTopY, footerWithMarginTopY, historyNextPageTopY, historyItems, writeFooterCallback, writeHeaderCallback,
		{ dryRun: true, forceTwoColumns },
	)

	const simulatedHistoryWithMarginY = simulatedHistoryY + FONT_SPACING.M


	// Simulate writeSituation call (using dryRun option) to :
	// 1 - get bottom situation Y position : to know if we can write Situation section on the current page or the next page
	// 2 - get the total page count of the report.pdf : use this count to write page count on every page
	// (all History section pages and the eventual Situation section page)
	const anotherSimulatedSituationBottomY = writeSituation(pdf, simulatedHistoryWithMarginY, {
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
	}, { dryRun: true })

	const isSituationSectionOnNewPage = anotherSimulatedSituationBottomY > footerWithMarginTopY
	const lastPageNumber = isSituationSectionOnNewPage ? simulatedCurrentPageNumber + 1 : simulatedCurrentPageNumber

	// Since we have all needed informations, let's write the pdf file for real!
	const {
		y: historyY,
		currentPageNumber
	} = writeHistory(
		pdf, historyTopY, footerWithMarginTopY, historyNextPageTopY, historyItems, writeFooterCallback, writeHeaderCallback,
		{ dryRun: false, forceTwoColumns, nextPageSymbol: true },
		{ totalPageCount: lastPageNumber }
	)

	const historyWithMarginY = historyY + FONT_SPACING.M

	if (isSituationSectionOnNewPage && currentPageNumber < lastPageNumber) {
		addPage(pdf, writeHeaderCallback, writeFooterCallback)
		writePageNumber(pdf, lastPageNumber, lastPageNumber)
	}

	const situationTopY = (isSituationSectionOnNewPage && currentPageNumber < lastPageNumber) ? nextPageTopY : historyWithMarginY

	writeSituation(
		pdf, situationTopY,
		{
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
		}
	)
}
