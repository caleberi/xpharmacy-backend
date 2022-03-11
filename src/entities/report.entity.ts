import { UserRole } from '../constants/roles.constant';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  invoiceNumber: string;

  @Column()
  enteredBy: string;

  @Column()
  customer: UserRole;

  @Column()
  discount: number;

  @Column()
  netAmount: number;

  @Column()
  amountPaid: number;

  @Column()
  outstanding: number;

  @Column()
  costOfSale: number;
}
