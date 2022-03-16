import { EmployeeRepository } from '../repositories/employee.repositiory';
import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/deserializers/user.dto';
import { Employee } from 'src/entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository) {}

  async createUser(user: CreateUserDTO) {
    const newUser: Employee = this.repository.create(user);
    return this.repository.save(newUser);
  }
}
