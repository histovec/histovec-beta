import { helpers, email, required } from '@vuelidate/validators';

export const requiredMessageRules$ = helpers.withMessage('Le message est obligatoire. Veuilez le renseigner.', required)

export const requiredEmailRules$ = helpers.withMessage('L\'adresse email est obligatoire. Veuilez la renseigner.', required)

export const emailRules$ = helpers.withMessage('Saisissez une adresse avec un format valide, exemple : nom@exemple.fr', email)
