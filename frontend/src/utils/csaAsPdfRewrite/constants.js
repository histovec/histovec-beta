import { StandardFonts, rgb } from 'pdf-lib'

export const DEFAULT_RGB_COLOR = rgb(0, 0, 0)

// @TODO: to use in siv.js part when pdf-lib will be migrated
export const BULLET_POINT_CHAR = '\u2022'

// @TODO: This is the special char used by ATNTS's CSA
// It can only be used if importing custom font that support this special char
// Standard fonts don't support special chars : https://github.com/Hopding/pdf-lib/issues/217#issuecomment-542354411
// Not important for now
export const BICOLOR_ARROW_RIGHT_BULLET_CHAR = '\u2B9A'

export const MISSING_VALUE = 'non disponible'
export const RAPPORT_FILENAME = 'rapport'
export const TO_BE_CONTINUED_SYMBOL = '... / ...'

export const TOP_PAGE_MARGIN = 20
export const TOP_FOOTER_MARGIN = 700

export const BORDER_LEFT_PAGE_X = 45
export const MIDDLE_PAGE_X = 295
export const NEXT_PAGE_SYMBOL_X = 370
export const FOOTER_LOGO_X = 485

export const COLUMN_WIDTH = 250
export const TABBED_COLUMN_WIDTH = 90
export const LARGE_COLUMN_WIDTH = 230
export const LARGE_TABBED_COLUMN_WIDTH = 190
export const TAB_PREFIX = '                   '

export const FONT = StandardFonts.Helvetica
export const FONT_BOLD = StandardFonts.HelveticaBold
export const FONT_ITALIC = StandardFonts.HelveticaOblique


export const FONT_SIZES = {
	XS: 5,
	S: 8,
	M: 10,
	L: 12,
	XL: 20
}

export const FONT_SPACING = {
	XXS: 2,
	XS: 4,
	S: 5,
	M: 6,
	L: 8,
	XL: 12,
	XXL: 18,
	XXXL: 22
}

export const FONT_STYLES = {
	BOLD: 'BOLD',
	ITALIC: 'ITALIC',
	NORMAL: 'NORMAL'
}

export const DEFAULT_FONT_STYLE = FONT_STYLES.NORMAL

export const HORIZONTAL_TABULATION = {
	XS: 15,
	S: 30
}

export const QR_CODE_PIXEL_SIZE = 1.099
