import { UserModule } from './user.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from 'src/services/config.service';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ConfigModule } from './config.module';

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
      keys: ['APP_PORT', 'ENVIRONMENT', 'DATABASE_URI'],
    }),
    // database integration
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('databaseUri'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
