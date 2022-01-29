import {
  createSuccessResponse,
  createFailureResponse,
} from './../utils/responses.util';
import { UserDocument } from './../schemas/user.schema';
import { CreateUserDTO } from './../dtos/user.dto';
import { UserService } from './../services/user.service';
import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Res,
} from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() payload: CreateUserDTO) {
    try {
      const existingUser: UserDocument = await this.userService.findUserByEmail(
        payload.email,
      );
      if (existingUser) {
        throw new BadRequestException(
          createFailureResponse({ msg: 'Email already exist ' }),
        );
      }
      const newUser: UserDocument = await this.userService.createUser(payload);
      return createSuccessResponse(newUser);
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
