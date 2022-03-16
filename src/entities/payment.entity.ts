/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity('payments_table')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  invoiceNumber: string;

  @Column()
  invoiceDate: Date;

  @Column()
  outstanding: number;

  @OneToOne((type) => Customer)
  customer: Customer;
}
