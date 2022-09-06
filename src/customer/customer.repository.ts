import { Customer } from 'src/customer/customer.entity';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {}
