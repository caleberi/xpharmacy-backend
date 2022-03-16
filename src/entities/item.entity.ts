/* eslint-disable @typescript-eslint/no-unused-vars */
import { DrugType } from 'src/constants/drugs.constants';
import { ItemType } from 'src/constants/item.constants';
import { PackagingMode } from 'src/constants/packaging-mode.constants';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from './store.entity';

@Entity('items_table')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  abbrv: string;

  @Column({
    type: 'enum',
    enum: ItemType,
  })
  type: ItemType;

  @Column({
    type: 'enum',
    enum: DrugType,
    nullable: true,
  })
  drugType: DrugType;

  @Column({
    type: 'enum',
    enum: PackagingMode,
  })
  defaultPackaging: PackagingMode;

  @Column()
  defaultUnit: number;

  @Column()
  amountPrice: number;

  @OneToMany((type) => Store, (store) => store.name)
  stores: string[];
}
