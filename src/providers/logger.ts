import * as Winston from 'winston';
export const Logger = (
  options: {
    errorPath?: string;
    combinePath?: string;
    service?: string;
    description?: string;
  },
  environment?: string,
) => {
  const logger = Winston.createLogger({
    level: 'info',
    format: Winston.format.combine(
      Winston.format.colorize(),
      Winston.format.json(),
    ),
    defaultMeta: {
      service: options.service || 'default',
      description: options.description,
    },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new Winston.transports.File({
        filename: options.errorPath ? options.errorPath : 'error.log',
        level: 'error',
      }),
      new Winston.transports.File({
        filename: options.combinePath ? options.combinePath : 'combined.log',
      }),
    ],
  });

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (environment != 'production' || process.env.NODE_ENV !== 'production') {
    logger.add(
      new Winston.transports.Console({
        format: Winston.format.simple(),
      }),
    );
  }
  return logger;
};
