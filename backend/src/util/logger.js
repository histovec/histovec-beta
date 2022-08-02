import { createLogger, format, transports } from 'winston'
import { inspect } from 'util'
import config from '../config.js'

const { combine, timestamp, label, printf } = format

const TECH_LABEL = 'tech'
const APP_LABEL = 'app'

const { isProd, isTest } = config

// DEBUG logs are only displayed for LOCAL development
// All other environments use INFO log level (except TEST mode using WARN log level)
const level = isProd ? 'info' : isTest ? 'warn' : 'debug'

const consoleOptions = {
  level,
  json: false,
  colorize: !isProd,
}

const inspectOptions = {
  colors: config.isDevelopmentMode,
  compact: !config.isDevelopmentMode,
  depth: null,
}

const logJsonFormat = printf(({ label, level, message, timestamp }) => {
  return inspect({
    content: typeof message === 'string' ? { default: message } : message,
    meta: {
      level,
      label,
      timestamp,
    },
  },
  inspectOptions)
})

const logFormat = printf(({ level, message }) => `${level} ${message}`)

export const techLogger = createLogger({
  format: combine(
    label({ label: TECH_LABEL }),
    timestamp(),
    isTest ? logFormat : logJsonFormat,
  ),
  transports: [new transports.Console(consoleOptions)],
  exitOnError: false,
})

export const appLogger = createLogger({
  format: combine(
    label({ label: APP_LABEL }),
    timestamp(),
    isTest ? logFormat : logJsonFormat,
  ),
  transports: [new transports.Console(consoleOptions)],
  exitOnError: false,
})

const syslogFormat = printf(({ level, message, timestamp }) => {
  const { key, value, tag } = message

  if (!key) {
    return inspect(
      'INVALID LOGGER USAGE: 1st argument of logger should be an object with a required "key" key and some optionnal keys: "value", "tag".',
      inspectOptions,
    )
  }

  const completeValue = typeof value === 'object' ? JSON.stringify(value) : value
  const completeTag = tag ? ` [${tag}]` : ''

  // @todo @syslog1:
  // Utiliser ce format pour remplacer tous les logs de l'application via l'utilitaire syslogLogger

  // /!\ DON'T TOUCH without working with data logs engineer) /!\
  // This format has been defined with data logs engineer for production exploitation.
  // Syslog format avec tag: <timestamp> <application_name> [<tag>] <log_level>: <key> <value>
  // Syslog format sans tag: <timestamp> <application_name> <log_level>: <key> <value>
  return inspect(
    `${timestamp} ${config.apiName}${completeTag} ${level}: ${key} ${completeValue}`,
    inspectOptions,
  )
})

export const syslogLogger = createLogger({
  level,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.metadata({ fillExcept: ['timestamp', 'level', 'message'] }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        syslogFormat,
      ),
    }),
  ],
  exitOnError: false,
})
