import { LOGGER_OPTION } from '../constants/modules.constants';
// import { AppCacheModule } from './appcache.module';
import { Module } from '@nestjs/common';
import {} from 'src/employee/employee.controller';
// import * as RedisStore from 'cache-manager-redis-store';
import { Logger } from 'src/utils/logger.util';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from 'src/customer/customer.controller';
import { CustomerService } from 'src/customer/customer.service';
import { CustomerRepository } from 'src/customer/customer.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerRepository]),
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: LOGGER_OPTION,
      useValue: Logger.createLogger({
        errorPath: path.join(__dirname, '../customer-service-error.log'),
        combinePath: path.join(__dirname, '../customer-service-combined.log'),
        service: 'CustomerService',
      }),
    },
  ],
  exports: [],
})
export class CustomerModule {}
