import { Customer } from './customer.entity';
import { LOGGER_OPTION } from '../constants/modules.constants';
import { ResponseHelper } from '../utils/response.util';
import { CreateUserDTO } from '../base_dto/user.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import * as Winston from 'winston';
import { CustomerService } from 'src/customer/customer.service';
// import { Cache } from 'cache-manager';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly userService: CustomerService,
    @Inject(LOGGER_OPTION) private readonly logger: Winston.Logger,
  ) {}

  @Post()
  async createUser(@Body() payload: CreateUserDTO) {
    try {
      const newUser: Customer = await this.userService.createUser(payload);
      return ResponseHelper.createSuccessResponse(newUser);
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
