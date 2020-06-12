import {
	degrees,
  pushGraphicsState,
  moveTo,
  lineTo,
  closePath,
  setFillingColor,
  fill,
  popGraphicsState,
} from 'pdf-lib'

import {
	// COLUMN_WIDTH,
	DEFAULT_FONT_STYLE,
	DEFAULT_RGB_COLOR,
	FONT_SIZES,
	FONT_SPACING,
	FONT_STYLES,
	FOOTER_LOGO_X,
	// LARGE_COLUMN_WIDTH,
	// LARGE_TABBED_COLUMN_WIDTH,
	// TABBED_COLUMN_WIDTH,
	// TAB_PREFIX
} from './constants'


const getEmbeddedFont = ({ style, embeddedFonts }) => {
	const embeddedFont = embeddedFonts[style]

	if (!embeddedFont) {
		console.error(`No available police for style ${style}. Default to: ${DEFAULT_FONT_STYLE}`)  // eslint-disable-line no-console
		return embeddedFonts[DEFAULT_FONT_STYLE]
	}

	return embeddedFont
}

export const drawFilledRectangle = ({
	page,
	x,
	y,
	height,
	width,
	color
}) => {
	page.pushOperators(
		pushGraphicsState(),
		moveTo(x, y),
		lineTo(x + width, y),
		lineTo(x + width, y - height),
		lineTo(x, y - height),
		closePath(),
		setFillingColor(color),
		fill(),
		popGraphicsState(),
	)
}

// export const getTextLinesWithSplit = (
// 	textLines,
// 	{ onlyOneColumn }={ onlyOneColumn: false },
//   { tabPrefix }={ tabPrefix: TAB_PREFIX }
// ) => {
// 	const textLimit = onlyOneColumn ? LARGE_COLUMN_WIDTH : COLUMN_WIDTH
// 	const tabbedTextLimit = onlyOneColumn ? LARGE_TABBED_COLUMN_WIDTH : TABBED_COLUMN_WIDTH

// 	return textLines.map((textLine) => {
// 		const splittedContent = page.splitTextToSize(textLine, textLimit)
// 		const contentToTab = splittedContent.slice(1)
// 		const tabbedContent = (
// 			contentToTab.length ?
// 			(page.splitTextToSize(contentToTab.join(' '), tabbedTextLimit)).map((line)=> `${tabPrefix}${line}`) :
// 			[]
// 		)

// 		return {
// 			content: textLine,
// 			splittedContent: [splittedContent[0], ...tabbedContent]
// 		}
// 	})
// }

export const writeMainTitle = ({ page, embeddedFonts, x, y, title }) => {
	const mainTitleY = writeText({
		page,
		embeddedFonts,
		x,
		y,
		text: title,
		center: true,
		size: FONT_SIZES.XL,
		style: FONT_STYLES.BOLD
	})

	const nextY = mainTitleY - FONT_SPACING.S
	return nextY
}

export const writePageNumber = ({
	page,
	embeddedFonts,
	y,
	pageNumber,
	totalPageNumber
}) => {
	return writeText({
		page,
		embeddedFonts,
		x: FOOTER_LOGO_X,
		y,
		text: `Page ${pageNumber} / ${totalPageNumber}`
	})
}

export const writeText = (
	{
		page,
		embeddedFonts,
		x,
		y,
		text,
		center = false,
		lineHeight,
		maxWidth = null,
		multiLines = false,
		rotationAngle = null,
		size = FONT_SIZES.M,
		style = FONT_STYLES.NORMAL,
		dryRun = false
	} = {}
) => {
	const embeddedFont = getEmbeddedFont({ style, embeddedFonts })
	const textHeight = embeddedFont.heightAtSize(size)
	const textY = rotationAngle ? y : y - textHeight

	let textX = x

	if (center) {
		const textWidth = embeddedFont.widthOfTextAtSize(text, size)
		textX = page.getWidth() / 2 - textWidth / 2
	}

	if (!dryRun) {
		page.drawText(text, {
			color: DEFAULT_RGB_COLOR,
			font: embeddedFont,
			size,
			x: textX,
			y: textY,
			...(lineHeight ? { lineHeight } : {}),
			...(maxWidth ? { maxWidth } : {}),
			...(rotationAngle ? { rotate: degrees(rotationAngle) } : {})
		})
	}

	if (multiLines) {
		const height = lineHeight || textHeight
		const nbLines = multiLines ? text.split('\n').length : 1
		const nextY = y - (nbLines * height)

		return nextY
	}

	return textY
}

export const writeTitle = (
	{
		page,
		embeddedFonts,
		x,
		y,
		title,
		center = false,
		style = FONT_STYLES.BOLD,
		dryRun = false
  } = {}
) => {
	const textY = writeText({
		page,
		embeddedFonts,
		x,
		y,
		text: title,
		center,
		size: FONT_SIZES.L,
		style,
		dryRun
	})

	return textY - FONT_SPACING.L
}

export const writeWithSpacing = (
	{
		page,
		embeddedFonts,
		x,
		y,
		textLines,
		increaseLineHeightOf,
		maxWidth,
		size = FONT_SIZES.M,
		style = FONT_STYLES.NORMAL,
		dryRun = false
	} = {}
) => {
	if (!textLines.length) {
		return y
	}


	const nextY = writeText({
		page,
		embeddedFonts,
		x,
		y,
		text: textLines.join('\n'),
		lineHeight: increaseLineHeightOf ? size + increaseLineHeightOf : size,
		maxWidth,
		multiLines: true,
		size,
		style,
		dryRun
	})

	return nextY
}
