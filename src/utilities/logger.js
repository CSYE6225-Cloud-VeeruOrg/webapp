const { createLogger, format, transports, config, addColors } = require('winston');

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  verbose: 5,
  debug: 6,
  silly: 7,
};

addColors({ ...config.syslog.colors, fatal: config.syslog.colors.notice });

const logger = createLogger({
  levels: levels,
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      const uppercaseLevel = level.toUpperCase();
      return `${timestamp} ${uppercaseLevel}: ${message}`;
    })
  ),
  transports: [
    new transports.Console({format: format.combine(
      format.timestamp(),
      format.colorize(),
      format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
      })
    )}), 
    new transports.File({ filename: '/opt/app.log' })
  ],
});

module.exports = logger;
