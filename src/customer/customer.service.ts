import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/base_dto/user.dto';
import { Customer } from 'src/customer/customer.entity';
import { CustomerRepository } from 'src/customer/customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly repository: CustomerRepository) {}

  async createUser(user: CreateUserDTO) {
    const newUser: Customer = this.repository.create(user);
    return this.repository.save(newUser);
  }
}
