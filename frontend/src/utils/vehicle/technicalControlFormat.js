import dayjs from 'dayjs'

import icons from '@/assets/json/techControlIcons.json'
import { LABELS_SINCE_20_05_2018, LABELS_BEFORE_20_05_2018 } from '../../constants/vehicle/technicalControl'
import { FR_DATE_FORMAT, ISO_DATE_FORMAT } from '../../assets/js/format.js'


const labelize = (controle) => {
	const iconNature = icons.nature[controle.ct_nature]
	const iconResultat = icons.resultat[controle.ct_resultat]
	const controleDate = dayjs(controle.ct_date, FR_DATE_FORMAT)

	const CHANGE_LABEL_DATE = dayjs('2018-05-20')
	const isOldLabel = controleDate.isBefore(CHANGE_LABEL_DATE)

	const labels = isOldLabel ? LABELS_BEFORE_20_05_2018 : LABELS_SINCE_20_05_2018

	return {
		id: controle.ct_id,
		date: controle.ct_date,
		isoFormatDate: controleDate.format(ISO_DATE_FORMAT),
		nature: controle.ct_nature,
		natureLabel: labels.nature[controle.ct_nature],
		natureIcon: [iconNature.icon, iconNature.color, iconNature.size],
		resultat: controle.ct_resultat,
		resultatIcon: [iconResultat.icon, iconResultat.color, iconResultat.size],
		resultatLabel: labels.resultat[controle.ct_resultat],
		km: controle.ct_km,
		kmLabel: new Intl.NumberFormat().format(controle.ct_km),
	}
}

export const labelizeTechnicalControls = (controles=[]) => {
	return controles.map((controle) => labelize(controle))
}