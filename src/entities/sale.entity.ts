/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  item: string;

  @Column()
  packaging: number;

  @Column()
  stock: number;

  @Column()
  unit: number;

  @Column()
  quantity: number;

  @Column()
  unitPrice: number;

  @Column()
  total: number;

  @Column()
  invoiceNumber: number;

  @Column()
  invoiceDate: Date;

  @Column()
  timeCreated: Date;

  @OneToOne((type) => Customer)
  customer: Customer;
}
