/* eslint-disable @typescript-eslint/no-unused-vars */
import { Customer } from './customer.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethods } from 'src/constants/payment-methods.constants';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  refNumber: number;

  @Column()
  item: string;

  @Column()
  unit: number;

  @Column()
  quantity: number;

  @Column()
  unitPrice: number;

  @Column()
  totalCostPrice: number;

  @Column()
  taxPerTotalCostPrice: number;

  @Column()
  issuedDate: Date;

  @Column()
  dueDate: Date;

  @Column()
  deliveryDate: Date;

  @OneToOne((type) => Customer)
  customer: Customer;

  @Column({
    type: 'enum',
    enum: PaymentMethods,
  })
  paymentMethod: PaymentMethods;

  @OneToOne((type) => Customer)
  bankAccount: string;
}
