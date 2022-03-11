/* eslint-disable @typescript-eslint/no-unused-vars */
import { Item } from './item.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Expired {
  @PrimaryGeneratedColumn()
  serialId: number;

  @OneToOne((type) => Item)
  item: Item;

  @Column()
  stockBalance: number;

  @Column()
  quantityDisposed: number;
}
