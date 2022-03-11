/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomerModule } from './customer.module';
import { EmployeeModule } from './employee.module';
import { Inject, Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from 'src/services/config.service';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ConfigModule } from './config.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ScheduledZipperAndUploader } from 'src/providers/zipper';
import { LOGGER_OPTION } from 'src/constants/modules.constants';
import { Logger } from 'src/providers/logger';
import * as path from 'path';
import * as Winston from 'winston';

@Module({
  imports: [
    ConfigModule.register({
      // if options is not passed then it will default  loading via NestJS
      // add environment  directory for synchronous loading before loading object into
      // application
      file: './deployments/development/.env',
      // pass in the stored name of the env variable in the .env file
      // not that the output on the config service will be in camelCase
      // e.g 'APP_PORT' maps to 'appPort'
      keys: [
        'APP_PORT',
        'ENVIRONMENT',
        'DATABASE_URI',
        'REDIS_PORT',
        'REDIS_HOST',
      ],
    }),
    // database integration
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get('databaseUri'),
    //   }),
    //   inject: [ConfigService],
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        ({
          type: configService.get('dbDriver') || 'postgres',
          host: configService.get('dbHost') || 'localhost',
          port: configService.get('dbPort') || 5432,
          username: configService.get('dbUsername') || 'postgres',
          password: configService.get('dbPassword') || 'postgres',
          database: configService.get('dbDatabase') || 'x_pharmacy_backend',
          entities: configService.get('dbEntitiesLocation')
            ? [__dirname + configService.get('dbEntitiesLocation')]
            : [__dirname + '../../**/*.entity{.ts,.js}'],
          retryAttempts: configService.get('dbRetryAttempts') || 10,
          retryDelays: configService.get('dbRetryDelays') || 3000,
          autoLoadEntities:
            Boolean(configService.get('dbAutoLoadEntities')) || false,
          keepConnectionAlive:
            configService.get('dbKeepConnectionAlive') || true,
          synchronize:
            configService.get('appEnvironment') == 'production' ? false : true,
        } as TypeOrmModuleOptions),
      inject: [ConfigService],
    }),
    EmployeeModule,
    CustomerModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: LOGGER_OPTION,
      useValue: Logger({
        errorPath: path.join(__dirname, '../app-service-error.log'),
        combinePath: path.join(__dirname, '../app-service-combined.log'),
        service: 'AppService',
      }),
    },
    {
      provide: ScheduledZipperAndUploader,
      useClass: ScheduledZipperAndUploader,
    },
  ],
})
export class AppModule {
  constructor(
    private readonly zipper: ScheduledZipperAndUploader,
    private readonly configService: ConfigService,
    @Inject(LOGGER_OPTION) private readonly logger: Winston.Logger,
  ) {
    zipper
      .createZipperQueue({
        prefix: 'q',
        redis: {
          port: +configService.get('redisPort') || 6379,
          host: (configService.get('redisHost') as string) || 'localhost',
        },
      })
      .register('schedule success', function (job) {
        //a highly recommended place to attach
        //job instance level events listeners
        job
          .on('complete', function (result: any) {
            console.log('Job completed with data ', result);
          })
          .on(
            'failed attempt',
            function (errorMessage: any, doneAttempts: any) {
              console.log('Job failed');
            },
          )
          .on('failed', function (errorMessage: any) {
            console.log('Job failed');
          })
          .on('progress', function (progress: string, data: any) {
            console.log(
              '\r  job #' + job.id + ' ' + progress + '% complete with data ',
              data,
            );
          });
      })
      .setFileGlobs({
        pattern: '/**/*.log',
        time: {
          pattern: '0 0 0 * * *',
          timezone: 'Africa/Lagos',
        },
        uploadUrl: {
          uri: 'http://example.com',
          headers: {
            method: 'POST',
          },
        },
        cronSetting: {
          service: 'log-zipper',
          attempts: 3,
          priority: 'high',
          backoff: 1,
        },
        zipFormat: 'gzip',
      })
      .zip(logger);
  }
}
