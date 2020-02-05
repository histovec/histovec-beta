import { writeFooter } from './footer'

import {
	ALIGN,
	FONT_SIZES,
	FONT_SPACING,
	FONT_STYLES,
	FIRST_COLUMN_X,
	SECOND_COLUMN_X,
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

const getBalancedTextLinesForPage = (topY, remainingHeight, maxColumnLinesForPage, itemsWithSplit, { onlyOneColumn }={
	onlyOneColumn: false
}) => {
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
			secondColumn: {
				x: -1,
				y: -1,
				items: []
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

const getHistoryItemsByPage = (pdf, firsPageTopY, bottomY, bottomHistoryTitleForNextPage, historyItemSize, historyItems) => {
	let remainingHeight = bottomY - firsPageTopY
	let maxColumnLinesForPage = Math.floor(remainingHeight / historyItemSize)

	let historyItemsWithSplit, firstColumn, secondColumn, remainingItems

	// All lines fit in first page and one column
	if (historyItems.length <= maxColumnLinesForPage) {
		historyItemsWithSplit = getTextLinesWithSplit(pdf, historyItems, { onlyOneColumn: true });
		({
			firstColumn,
			secondColumn,
			remainingItems
		} = getBalancedTextLinesForPage(firsPageTopY, remainingHeight, maxColumnLinesForPage, historyItemsWithSplit, { onlyOneColumn: true })
		)

	} else {  // First page with many columns
		historyItemsWithSplit = getTextLinesWithSplit(pdf, historyItems);
		({
			firstColumn,
			secondColumn,
			remainingItems
		} = getBalancedTextLinesForPage(firsPageTopY, remainingHeight, maxColumnLinesForPage, historyItemsWithSplit)
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

const writeHistory = (pdf, y, topFooterY, bottomHistoryTitleForNextPage, historyItems, writeFooterCallback, writeHeaderCallback) => {
	writeTitle(pdf, FIRST_COLUMN_X, y, 'Historique du véhicule')

	const topY = y + FONT_SPACING.L
	const historyItemSize = FONT_SPACING.S
	const bottomY = topFooterY - FONT_SPACING.S
	const historyItemsByPage = getHistoryItemsByPage(pdf, topY, bottomY, bottomHistoryTitleForNextPage, historyItemSize, historyItems)
	const totalPageNumber = Object.keys(historyItemsByPage).length

	for (let [pageNumber, historyItemsForPage] of Object.entries(historyItemsByPage)) {
		if (pageNumber > 1) {
			pdf.addPage()
			const nextY = writeHeaderCallback(pdf)
			writeTitle(pdf, FIRST_COLUMN_X, nextY, 'Historique du véhicule (suite)')
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

		if (historyItemsForPage.secondColumn) {
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
	volVehicule},
	{ y }={
		y: 7
	}) => {
	const newY = previousY + y

	writeTitle(pdf, FIRST_COLUMN_X, newY, 'Situation administrative du véhicule')
	const lastFirstY = writeFirstSituationColumn(pdf, previousY, { gage, hasPVE, otci, ove, pv, saisie, x: FIRST_COLUMN_X, y })
	const lastSecondY = writeSecondSituationColumn(pdf, previousY, { annulation, duplicataTitre, perteTitre, suspension, suspensions, volTitre, volVehicule, x: SECOND_COLUMN_X, y })

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
export const writeContent = (pdf,
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

	const writeFooterCallback = (pdf) => {
		return writeFooter(pdf, { histoVecLogo, qrCodeUrl, validityDate, webSiteUrl })
	}

	const bottomHeaderY = writeHeaderCallback(pdf)
	console.log('bottomHeaderY = ', bottomHeaderY)  // eslint-disable-line no-console
	if (annulation === 'Oui') {
		const vehicleIdentificationAnnulationY = writeVehicleIdentification(pdf, plaque, premierCertificat, vin, marque)
		const annulationY = vehicleIdentificationAnnulationY + FONT_SPACING.XL * 2
		writeAnnulation(pdf, annulationY, dateAnnulation)
		writeFooterCallback(pdf)
		writePageNumber(pdf, 1, 1)

		return
	}
	const vehicleIdentificationY = writeVehicleIdentification(pdf, plaque, premierCertificat, vin, marque)

	const situationY = writeSituation(pdf, vehicleIdentificationY + FONT_SPACING.XS, {
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
	const nextPageTopY = bottomHeaderY + FONT_SIZES.S  // Adding history title

	writeHistory(pdf, situationY + FONT_SPACING.XS, topFooterY, nextPageTopY, historyItems, writeFooterCallback, writeHeaderCallback)
}
