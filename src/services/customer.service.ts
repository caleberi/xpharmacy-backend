import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/deserializers/user.dto';
import { Customer } from 'src/entities/customer.entity';
import { CustomerRepository } from 'src/repositories/customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly repository: CustomerRepository) {}

  async createUser(user: CreateUserDTO) {
    const newUser: Customer = this.repository.create(user);
    return this.repository.save(newUser);
  }
}
