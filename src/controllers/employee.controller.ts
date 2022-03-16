import { EmployeeService } from '../services/employee.service';
import { LOGGER_OPTION } from '../constants/modules.constants';
import { createSuccessResponse } from '../utils/responses.util';
import { CreateUserDTO } from '../deserializers/user.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import * as Winston from 'winston';
import { Employee } from 'src/entities/employee.entity';
// import { Cache } from 'cache-manager';

@Controller('users')
export class EmployeeController {
  constructor(
    private readonly userService: EmployeeService,
    @Inject(LOGGER_OPTION) private readonly logger: Winston.Logger,
  ) {}

  @Post()
  async createUser(@Body() payload: CreateUserDTO) {
    try {
      const newUser: Employee = await this.userService.createUser(payload);
      return createSuccessResponse(newUser);
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
