import { UserRepository } from './../repositories/user.repositories';
import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/dtos/user.dto';
@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}
  async createUser(body: CreateUserDTO) {
    return await this.repository.create(body);
  }
  async findUserByEmail(email: string) {
    return await this.repository.findOne({ email });
  }
}
