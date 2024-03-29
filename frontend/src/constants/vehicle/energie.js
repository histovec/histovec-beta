// @unused: Enum qui n'est plus utilisé désormais
// Cela peut être une bonne idée de le garder car il permet de documenter les différents types d'énergies

export const ENERGIE = {
	'1A': '1A',
	AC: 'AC',
	EE: 'EE',
	EG: 'EG',
	EH: 'EH',
	EL: 'EL',
	EM: 'EM',
	EN: 'EN',
	EP: 'EP',
	EQ: 'EQ',
	ER: 'ER',
	ES: 'ES',
	ET: 'ET',
	FE: 'FE',
	FG: 'FG',
	FH: 'FH',
	FL: 'FL',
	FN: 'FN',
	FQ: 'FQ',
	G2: 'G2',
	GA: 'GA',
	GE: 'GE',
	GF: 'GF',
	GG: 'GG',
	GH: 'GH',
	GL: 'GL',
	GM: 'GM',
	GN: 'GN',
	GO: 'GO',
	GP: 'GP',
	GQ: 'GQ',
	GZ: 'GZ',
	H2: 'H2',
	HE: 'HE',
	HH: 'HH',
	NE: 'NE',
	NH: 'NH',
	OL: 'OL',
	PE: 'PE',
	PH: 'PH',
	PL: 'PL',
	XX: 'XX',
}

export const DIESEL = [
	ENERGIE.GA,
	ENERGIE.GE,
	ENERGIE.GF,
	ENERGIE.GG,
	ENERGIE.GH,
	ENERGIE.GO,
	ENERGIE.GQ,
	ENERGIE.PL,
]

export const ELECT_HYDRO = [
	ENERGIE.AC,
	ENERGIE.EL,
	ENERGIE.H2,
	ENERGIE.HE,
	ENERGIE.HH,
]

export const ESSENCE = [
	ENERGIE.EH,
	ENERGIE.ES,
	ENERGIE.ET,
	ENERGIE.FE,
	ENERGIE.FH,
]


export const GAZ = [
	ENERGIE.EG,
	ENERGIE.EN,
	ENERGIE.EP,
	ENERGIE.EQ,
	ENERGIE.FG,
	ENERGIE.FN,
	ENERGIE.G2,
	ENERGIE.GN,
	ENERGIE.GP,
	ENERGIE.GZ,
	ENERGIE.NH,
	ENERGIE.PH,
]

export const HYBRID_RECH = [
	ENERGIE.EE,
	ENERGIE.EM,
	ENERGIE.ER,
	ENERGIE.FL,
	ENERGIE.GL,
	ENERGIE.GM,
	ENERGIE.NE,
	ENERGIE.PE,
]
