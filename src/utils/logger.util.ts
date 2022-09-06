import * as Winston from 'winston';

type LoggerOptions =   {
  errorPath?: string;
  combinePath?: string;
  service?: string;
  description?: string;
  environment?:string;
}

export class Logger{

  static createLogger(opts?:LoggerOptions){
    const logger = Winston.createLogger({
      level: 'info',
      format: Winston.format.combine(
        Winston.format.colorize(),
        Winston.format.json(),
      ),
      defaultMeta: {
        service: opts.service || 'default',
        description: opts.description,
      },
      transports: [
        new Winston.transports.File({
          filename: opts.errorPath ? opts.errorPath : 'error.log',
          level: 'error',
        }),
        new Winston.transports.File({
          filename: opts.combinePath ? opts.combinePath : 'combined.log',
        }),
      ],
    });
  
    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    //
    if (opts.environment != 'production' || process.env.NODE_ENV !== 'production') {
      logger.add(
        new Winston.transports.Console({
          format: Winston.format.simple(),
        }),
      );
    }
    return logger;
  }
}
