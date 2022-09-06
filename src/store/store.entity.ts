/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Item } from '../product/product.entity';
@Entity('stores_table')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToMany((type) => Item, (item) => item.stores)
  items: Item[];

  @Column('text', { array: true })
  phoneNumbers: string[];

  @Column('text', { array: true })
  accounts: string[];
}
