import { EmployeeRepository } from './employee.repositiory';
import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/base_dto/user.dto';
import { Employee } from 'src/employee/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository) {}

  async createUser(user: CreateUserDTO) {
    const newUser: Employee = this.repository.create(user);
    return this.repository.save(newUser);
  }
}
