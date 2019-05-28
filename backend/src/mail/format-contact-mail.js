import { getHtmlBody } from './body-mail-template'

export const formatContactMail = (subject, message) => {
  return (subject, getHtmlBody(message))
}
