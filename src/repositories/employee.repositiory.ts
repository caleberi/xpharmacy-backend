import { Employee } from 'src/entities/employee.entity';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(Employee)
export class EmployeeRepository extends Repository<Employee> {}
