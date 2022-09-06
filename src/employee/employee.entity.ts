import { UserRole } from '../classes/user/roles.constant';
import { Entity, Column } from 'typeorm';
import { User } from '../classes/user/user.entity';

@Entity('employees_table')
export class Employee extends User {
  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
    default: [UserRole.SALE_REP],
  })
  role: UserRole[];

  @Column()
  monthlysalary: number;
}
