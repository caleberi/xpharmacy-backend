import { LOGGER_OPTION } from '../constants/modules.constants';
// import { AppCacheModule } from './appcache.module';
import { Module } from '@nestjs/common';
import {} from 'src/controllers/employee.controller';
// import * as RedisStore from 'cache-manager-redis-store';
import { Logger } from 'src/providers/logger';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from 'src/controllers/customer.controller';
import { CustomerService } from 'src/services/customer.service';
import { CustomerRepository } from 'src/repositories/customer.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerRepository]),
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
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: LOGGER_OPTION,
      useValue: Logger({
        errorPath: path.join(__dirname, '../customer-service-error.log'),
        combinePath: path.join(__dirname, '../customer-service-combined.log'),
        service: 'CustomerService',
      }),
    },
  ],
  exports: [],
})
export class CustomerModule {}
