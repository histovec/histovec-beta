import { ALIGN, FONT, FONT_SIZES, FONT_STYLES } from './constants'


export const getTextLinesWithSplit = (pdf, textLines, textLimit, prefix='') => {
	return textLines.map((textLine) => {
		const splittedContent = pdf.splitTextToSize(textLine, textLimit)
		return {
			content: textLine,
			splittedContent: splittedContent.map((line, i) => i > 1 ? `${prefix}${line}` : line)
		}
	})
}

export const padString = (n, width, padChar='0') => {
	const stringifiedN = String(n)
	if (stringifiedN.length >= width) {
		return stringifiedN
	}

	const padding = new Array(width - stringifiedN.length + 1).join(padChar)
	return  `${padding}${stringifiedN}`
}

export const writeMainTitle = (pdf, x, y, title) => {
	writeText(pdf, x, y, title, {
		align: ALIGN.CENTER,
		size: FONT_SIZES.XL,
		style: FONT_STYLES.BOLD
	})
}

export const writePageNumber = (pdf, pageNumber, totalPageNumber, { x, y }={
	x: 170,
	y: 288
}) => {
	writeText(pdf, x, y, `Page ${pageNumber} / ${totalPageNumber}`)
}

export const writeText = (pdf, x, y, content, {
	align,
	rotation,
	size,
	style
}={
	align: null,
	rotation: null,
	size: FONT_SIZES.M,
	style: FONT_STYLES.NORMAL
}) => {
	pdf.setFont(FONT, style)
	pdf.setFontSize(size)
	pdf.text(x, y, content, null, rotation, align)
}

export const writeTitle = (pdf, x, y, title, { align, style }={
	align: null,
	style: FONT_STYLES.BOLD
}) => {
	writeText(pdf, x, y, title, {
		align,
		size:FONT_SIZES.L,
		style
	})
}

export const writeWithSpacing = (pdf, x, y, spacing, textLines, {
	size,
	style,
}={
	size: FONT_SIZES.M,
	style: FONT_STYLES.NORMAL
}) => {
	if (!textLines.length) {
		return
	}

	pdf.setFont(FONT, style)
	pdf.setFontSize(size)

	let nextY = y
	textLines.forEach((textLine, i) => {
		nextY = y + spacing * i
		pdf.text(x, nextY, textLine)
	})

	return nextY
}
