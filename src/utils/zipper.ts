/**
 *  Create  a queue  that uses a  moment supported  timer that
 *  and worker thread to process given filepath  and compress the into a location
 * using node 'zlib'
 */

import * as util from 'util';
import * as glob from 'glob';
import * as Winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';
import { pipeline } from 'stream';
import { createDeflate, createGzip } from 'zlib';
import axios from 'axios';
import * as FormData from 'form-data';
import Scheduler = require('kue-scheduler');
import { Status } from 'src/constants/statuses.constants';
const kue = Scheduler;
const promisifyGlobMatcher = util.promisify(glob);
const pipe = util.promisify(pipeline);

export type CronSetting = {
  service: string;
  attempts?: number;
  backoff?: number;
  priority?: 'low' | 'normal' | 'medium' | 'high' | 'critical';
  unique?: boolean;
};
export type TimeGlob = {
  pattern: string; // using node-cron supported pattern
  timezone?: string;
};

export type FileGlob = {
  pattern: string;
  time: TimeGlob;
  uploadUrl?: UploadUrl;
  outputPath?: string;
  cronSetting: CronSetting;
  zipFormat?: 'gzip' | 'deflate';
};

export type UploadUrl = {
  uri?: string;
  headers?: { [key: string]: any };
};

export type ParsedGlobOutput = {
  files: string[];
  time?: TimeGlob;
  uploadUrl?: UploadUrl;
  outputPath?: string;
  cronSetting?: CronSetting;
};

export class ScheduledZipperAndUploader {
  private state = 0;
  private _fileGlobs: FileGlob[]; // array of 'FileGlob' to be used by the zipper
  private queue: Scheduler;
  public setFileGlobs(...fileGlobs: FileGlob[]) {
    this._fileGlobs = fileGlobs;
    return this;
  }

  createZipperQueue(opts: {
    prefix?: string | 'q'; // used kue scheduler but defaults to 'q'
    redis?: {
      // redis configuration
      [key: string]: any;
      port: number;
      host: string;
    };
    restore?: boolean; //  restore schedules in case of restarts or other causes.
    worker?: boolean; // allow instance to process the scheduled jobs from other process
    skipConfig?: boolean; // tells kue-scheduler to skip enabling enabling key expiry notification
    enableExpiryNotifications?: boolean; // explicitly set enableExpiryNotifications
  }) {
    this.queue = kue.createQueue(opts);
    if (opts.enableExpiryNotifications) 
      this.queue.enableExpiryNotifications();
    return this;
  }

  register(
    event:
      | 'schedule error'
      | 'schedule success'
      | 'already scheduled'
      | 'lock error'
      | 'unlock error'
      | 'scheduler unknown job expiry key'
      | 'restore success'
      | 'restore error',
    callback: (d: any) => void,
  ): ScheduledZipperAndUploader {
    this.queue.on(event, callback);
    return this;
  }

  async zip(logger: Winston.Logger) {
    try {
      const parsedGlobOutputs: ParsedGlobOutput[] = [];
      for (const fileGlob of this._fileGlobs) {
        const d = {
          files: await promisifyGlobMatcher(
            path.resolve(__dirname, '../').replace(/\\/g, '/') +
              fileGlob.pattern,
            {
              cwd: __dirname,
            },
          ),
          ...fileGlob,
        };
        parsedGlobOutputs.push(d);
      }
      if (this.state == 0) this.clear(logger);

      parsedGlobOutputs.forEach((value) => {
        const job = this.queue.createJob(value.cronSetting.service, {
          ...value,
          timezone: value.time.timezone,
        });
        if (value.cronSetting.attempts)
          job.attempts(value.cronSetting.attempts);
        if (value.cronSetting.backoff) job.backoff(value.cronSetting.backoff);
        if (value.cronSetting.priority)
          job.priority(value.cronSetting.priority);
        if (value.cronSetting.unique) job.unique(value.cronSetting.service);

        logger.info(
          `🚩 REGISTERING JOB {${value.cronSetting.service}} WITH PATTERN : ${value.time.pattern}`,
        );
        this.queue.every(value.time.pattern, job);

        logger.info(
          `⛳ COMMENCE PROCESSING OF JOB  {${value.cronSetting.service}} WITH PATTERN : ${value.time.pattern}`,
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.queue.process(
          value.cronSetting.service,
          async function (job: any, done: any) {
            try {
              const destination: string = job.data.uploadUrl?.uri
                ? job.data.uploadUrl.uri
                : job.data.outputPath
                ? job.data.outputPath
                : path.join(__dirname, '../zipped');

              if (await zipFile(job.data, destination, done, logger)) {
                logger.info(
                  `🏃 JUST SUCCESSFULLY ZIPPED ${
                    job.data.cronSetting.service
                  } FILES AT ${new Date().toISOString()}  AND STORED AT ${destination} `,
                );
              } else {
                logger.info(`FAILED TO  ZIP ${job.data.cronSetting.service}`);
              }
              return done(null, {
                service: job.data.cronSetting.service,
                completed_at: new Date().toISOString(),
              });
            } catch (err) {
              logger.error(err);
              throw err;
            }
          },
        );
      });
      return this;
    } catch (err) {
      throw err;
    }
  }

  clear(logger: Winston.Logger) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.queue.clear((err: any, res: any) => {
      if (err) {
        logger.error('Queue cleared with error 🔥');
        return;
      }
      // console.log(res);
      logger.info('🏖️  CLEARED QUEUE ...');
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/ban-types
async function zipFile(
  data: { [key: string]: any },
  destination: string,
  done: typeof Function,
  logger: Winston.Logger,
) {
  try {
    const files = data?.files;
    for await (const file of files) {
      const uploadToUrl = destination.startsWith('http');
      const exist = uploadToUrl ? false : fs.existsSync(destination);

      if (exist && !uploadToUrl) {
        await zzip(file, destination, {
          upload: false,
          headers: {},
          service: data.cronSetting?.service,
          zipFormat: data.zipFormat,
          logger,
        });
      } else if (!exist && !uploadToUrl) {
        fs.mkdirSync(destination);
        await zzip(file, destination, {
          upload: false,
          headers: {},
          service: data.cronSetting?.service,
          zipFormat: data.zipFormat,
          logger,
        });
      } else {
        await zzip(file, destination, {
          upload: true,
          headers: {},
          service: data.cronSetting?.service,
          zipFormat: data.zipFormat,
          logger,
        });
      }
      done();
    }
    return true;
  } catch (err) {
    done(err);
    return false;
  }
}

async function zzip(
  input: string,
  output: string,
  opts?: {
    upload?: boolean;
    headers?: { [key: string]: any };
    service?: string;
    zipFormat: string;
    logger: Winston.Logger;
  },
) {
  const logger = opts.logger;
  try {
    const gzip = opts.zipFormat
      ? opts.zipFormat != 'deflate'
        ? createGzip()
        : createDeflate()
      : createGzip();

    if (!fs.existsSync(input)) return;
    const source = fs.createReadStream(input);
    const baseName = path.basename(input) + '-' + Date.now();
    const extension = path.extname(input);
    const outputZipFilePath = !output.startsWith('http')
      ? output + '/' + baseName + '.gz'
      : output;
    let destination: fs.WriteStream;
    if (!opts.upload) {
      destination = fs.createWriteStream(outputZipFilePath);
      await pipe(source, gzip, destination);
      fs.unlink(input, (err) => {
        if (err) {
          throw err;
        }
        logger.info(`${input} was deleted`);
      });
      return;
    } else if (opts.upload) {
      const form: FormData = new FormData();
      form.append('zippedFile', source, {
        filename: baseName + extension + '.gz',
        contentType:
          opts.zipFormat == 'gzip' ? 'application/gzip' : 'application/deflate',
      });
      const response = await axios.post(output, form, {
        headers: {
          ...form.getHeaders(),
          ...opts.headers,
        },
      });
      if (response.status === Status.OK) {
        logger.info(
          `ZIPPED && UPLOADED FILE FROM SERVICE: ${opts.service} TO ${output} WITH RESPONSE: ${response.status}`,
        );
      } else {
        logger.info(
          `COULD NOT ZIP && UPLOAD FILE FROM SERVICE: ${opts.service} TO ${output} WITH RESPONSE: ${response.status}`,
        );
      }
      return;
    } else {
      return;
    }
  } catch (err) {
    throw err;
  }
}
