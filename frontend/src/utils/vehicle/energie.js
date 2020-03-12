import { DIESEL, ESSENCE, ELECT_HYDRO, GAZ, HYBRID_RECH } from '../../constants/vehicle/energie'
import { TYPE_CARBURANT } from '../../constants/vehicle/typeCarburant'

export const getTypeCarburant = (carburant) => {
	if (DIESEL.includes(carburant)) {
		return TYPE_CARBURANT.DIESEL
	} else if (ESSENCE.includes(carburant)) {
		return TYPE_CARBURANT.ESSENCE
	} else if (ELECT_HYDRO.includes(carburant)) {
		return TYPE_CARBURANT.ELECTRIQUE
	} else if (GAZ.includes(carburant)) {
		return TYPE_CARBURANT.GAZ
	} else if (HYBRID_RECH.includes(carburant)) {
		return TYPE_CARBURANT.HYBRID
	}
}
