import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsDefined, IsEmail, MinLength, Matches } from 'class-validator';
import Customer from './customer.entity';
import { passwordRegex, passwordMessage } from '../lib/constExports';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsDefined()
  @MinLength(3, {
    message: 'Name is too short',
  })
  name: string;

  @Column({ unique: true })
  @IsDefined()
  @IsEmail()
  email: string;

  @Column({ select: false })
  @IsDefined()
  @MinLength(8, {
    message: 'Password is too short',
  })
  @Matches(passwordRegex, { message: passwordMessage })
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ readonly: true, default: false, select: false })
  superUser: boolean;

  @OneToMany(type => Customer, customer => customer.createdBy)
  created: Customer[];

  @OneToMany(type => Customer, customer => customer.modifiedBy)
  modified: Customer[];
}
