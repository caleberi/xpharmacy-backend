import { Employee } from 'src/employee/employee.entity';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(Employee)
export class EmployeeRepository extends Repository<Employee> {}
