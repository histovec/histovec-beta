import { helpers, email, required } from '@vuelidate/validators';

export const required$ = helpers.withMessage('Le message est obligatoire. Veuilez le renseigner.', required)

export const emailMessage$ = () => helpers.withMessage(
  'Saisissez une adresse avec un format valide, exemple : nom@exemple.fr', email,
)
