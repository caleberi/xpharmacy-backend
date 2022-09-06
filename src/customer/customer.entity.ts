import { Invoice } from '../invoice/invoice.entity';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Payment } from '../payment/payment.entity';
import { UserRole } from '../classes/user/roles.constant';
import { Entity, Column, OneToMany } from 'typeorm';
import { User } from '../classes/user/user.entity';

@Entity('customers_table')
export class Customer extends User {
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @OneToMany((type) => Payment, (payment) => payment.customer)
  payments: Payment;

  @OneToMany((type) => Invoice, (invoice) => invoice.customer)
  invoice: Invoice;

  @Column()
  bankAccount: string;
}
