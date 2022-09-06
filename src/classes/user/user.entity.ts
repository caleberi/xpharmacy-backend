import { IsEmail, MaxLength } from 'class-validator';
import { CryptoGraphicalHelper } from 'src/utils/crypto.util';
import { Column, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';

const PASSWORD_SALT = 10;

const encodePassword: ValueTransformer = {
  to: async (entityValue: string) => {
    return await CryptoGraphicalHelper.encryptWithBcrypt(entityValue, PASSWORD_SALT);
  },
  from: (databaseValue: string) => {
    return databaseValue;
  },
};

export abstract class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 200,
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    unique: true,
    nullable: false,
  })
  @IsEmail()
  email: string;

  @Column({
    select: false,
    nullable: false,
    transformer: [encodePassword],
  })
  password: string;

  @Column({
    nullable: false,
  })
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  profileUrl: string;

  @Column({ type: 'text' })
  @MaxLength(400)
  address: string;
}
