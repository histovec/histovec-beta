import {
	ALIGN,
	COLUMN_WIDTH,
	FONT,
	FONT_SIZES,
	FONT_STYLES,
	LARGE_COLUMN_WIDTH,
	LARGE_TABBED_COLUMN_WIDTH,
	TABBED_COLUMN_WIDTH,
	TAB_PREFIX
} from './constants'


export const getTextLinesWithSplit = (
	pdf, textLines,
	{ onlyOneColumn }={ onlyOneColumn: false },
  { tabPrefix }={ tabPrefix: TAB_PREFIX }
) => {
	const textLimit = onlyOneColumn ? LARGE_COLUMN_WIDTH : COLUMN_WIDTH
	const tabbedTextLimit = onlyOneColumn ? LARGE_TABBED_COLUMN_WIDTH : TABBED_COLUMN_WIDTH

	return textLines.map((textLine) => {
		const splittedContent = pdf.splitTextToSize(textLine, textLimit)
		const contentToTab = splittedContent.slice(1)
		const tabbedContent = (
			contentToTab.length ?
			(pdf.splitTextToSize(contentToTab.join(' '), tabbedTextLimit)).map((line)=> `${tabPrefix}${line}`) :
			[]
		)

		return {
			content: textLine,
			splittedContent: [splittedContent[0], ...tabbedContent]
		}
	})
}

export const writeMainTitle = (pdf, x, y, title) => {
	return writeText(pdf, x, y, title, {
		align: ALIGN.CENTER,
		size: FONT_SIZES.XL,
		style: FONT_STYLES.BOLD
	})
}

export const writePageNumber = (
	pdf, pageNumber, totalPageNumber,
	{ x, y }={ x: 170, y: 288 }
) => {
	return writeText(pdf, x, y, `Page ${pageNumber} / ${totalPageNumber}`)
}

export const writeText = (
	pdf, x, y, content,
	{ align, rotation, size, style }={
		align: null,
		rotation: null,
		size: FONT_SIZES.M,
		style: FONT_STYLES.NORMAL
	}
) => {
	pdf.setFont(FONT, style)
	pdf.setFontSize(size)
	pdf.text(x, y, content, null, rotation, align)

	return y
}

export const writeTitle = (
	pdf, x, y, title,
	{ align, style }={
		align: null,
		style: FONT_STYLES.BOLD
	}
) => {
	return writeText(pdf, x, y, title, {
		align,
		size: FONT_SIZES.L,
		style
	})
}

export const writeWithSpacing = (
	pdf, x, y, spacing, textLines,
	{ dryRun }={ dryRun: false },
	{ size, style }={
		size: FONT_SIZES.M,
		style: FONT_STYLES.NORMAL
	}
) => {
	if (!textLines.length) {
		return
	}

	if (!dryRun) {
		pdf.setFont(FONT, style)
		pdf.setFontSize(size)
	}
	let nextY = y
	textLines.forEach((textLine, i) => {
		nextY = y + spacing * i
		if (!dryRun) {
			pdf.text(x, nextY, textLine)
		}
	})

	return nextY
}
