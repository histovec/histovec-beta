import { createLogger, format, transports } from 'winston'
import { inspect } from 'util'
import config from '../config.js'

const { printf } = format

const { isProd, isTest } = config

// DEBUG logs are only displayed for LOCAL development
// All other environments use INFO log level (except TEST mode using WARN log level)
const level = isProd ? 'info' : isTest ? 'warn' : 'debug'

const inspectOptions = {
  colors: config.isDevelopmentMode,
  compact: !config.isDevelopmentMode,
  depth: null,
}

const syslogFormat = printf(({ level, message, timestamp }) => {
  const { key, value, tag, uuid } = message

  if (!key) {
    return inspect(
      'INVALID LOGGER USAGE: 1st argument of logger should be an object with a required "key" key and some optionnal keys: "value", "tag".',
      inspectOptions,
    )
  }

  const completeValue = value ? typeof value === 'object' ? JSON.stringify(value) : value : ''
  const completeTag = tag ? ` [${tag}]` : ''

  const uuidTag = uuid ? ` ${uuid}` : ''

  return inspect(
    `${timestamp} ${config.apiName}${completeTag} ${level}${uuidTag}: ${key}${completeValue ? ' ' + completeValue : ''}`,
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
