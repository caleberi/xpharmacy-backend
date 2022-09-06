import { EmployeeController } from './employee.controller';
import { EmployeeRepository } from './employee.repositiory';
import { LOGGER_OPTION } from '../constants/modules.constants';
// import { AppCacheModule } from './appcache.module';
// import { User, UserHookMiddleware } from '../schemas/user.schema';
// import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeService } from './employee.service';
import { Module } from '@nestjs/common';
import {} from 'src/employee/employee.controller';
// import * as RedisStore from 'cache-manager-redis-store';
import { Logger } from 'src/utils/logger.util';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeRepository]),
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    {
      provide: LOGGER_OPTION,
      useValue: Logger.createLogger({
        errorPath: path.join(__dirname, '../employee-service-error.log'),
        combinePath: path.join(__dirname, '../employee-service-combined.log'),
        service: 'EmployeeService',
      }),
    },
  ],
  exports: [],
})
export class EmployeeModule {}
