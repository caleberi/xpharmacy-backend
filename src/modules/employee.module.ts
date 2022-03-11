import { EmployeeController } from './../controllers/employee.controller';
import { EmployeeRepository } from '../repositories/employee.repositiory';
import { LOGGER_OPTION } from '../constants/modules.constants';
// import { AppCacheModule } from './appcache.module';
// import { User, UserHookMiddleware } from '../schemas/user.schema';
// import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeService } from '../services/employee.service';
import { Module } from '@nestjs/common';
import {} from 'src/controllers/employee.controller';
// import * as RedisStore from 'cache-manager-redis-store';
import { Logger } from 'src/providers/logger';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeRepository]),
    // example : app cache usage
    // AppCacheModule.register({
    //   cache: {
    //     redis: {
    //       store: RedisStore,
    //       host: 'localhost',
    //       ttl: 100,
    //       max: 100,
    //     },
    //   },
    // }),
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    {
      provide: LOGGER_OPTION,
      useValue: Logger({
        errorPath: path.join(__dirname, '../employee-service-error.log'),
        combinePath: path.join(__dirname, '../employee-service-combined.log'),
        service: 'EmployeeService',
      }),
    },
  ],
  exports: [],
})
export class EmployeeModule {}
