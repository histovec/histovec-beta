import { StandardFonts, rgb } from 'pdf-lib'

export const DEFAULT_RGB_COLOR = rgb(0, 0, 0)

export const MISSING_VALUE = 'non disponible'
export const RAPPORT_FILENAME = 'rapport'
export const TO_BE_CONTINUED_SYMBOL = '... / ...'

export const TOP_PAGE_MARGIN = 10
export const TOP_FOOTER_MARGIN = 700

export const MULTILINES_MARGIN = 4

export const BORDER_LEFT_PAGE_X = 45
export const MIDDLE_PAGE_X = 295
export const NEXT_PAGE_SYMBOL_X = 505
export const FOOTER_LOGO_X = 485

export const COLUMN_WIDTH = 240
export const LARGE_COLUMN_WIDTH = 400

export const FONT = StandardFonts.Helvetica
export const FONT_BOLD = StandardFonts.HelveticaBold
export const FONT_ITALIC = StandardFonts.HelveticaOblique


export const FONT_SIZES = {
	XS: 5,
	S: 8,
	M: 10,
	L: 12,
	XL: 20,
}

export const FONT_SPACING = {
	XXS: 2,
	XS: 4,
	S: 5,
	M: 6,
	L: 8,
	XL: 12,
	XXL: 18,
	XXXL: 22,
}

export const FONT_STYLES = {
	BOLD: 'BOLD',
	ITALIC: 'ITALIC',
	NORMAL: 'NORMAL',
}

export const DEFAULT_FONT_STYLE = FONT_STYLES.NORMAL

export const HORIZONTAL_TABULATION = {
	XS: 15,
	S: 30,
}

export const QR_CODE_PIXEL_SIZE = 1.099
