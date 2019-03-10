import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsDefined, IsEmail, MinLength, Matches } from 'class-validator';
import Customer from './customer.entity';

const passwordMessage = `Password must contain a minimum of eight characters, at least
one uppercase letter, one lowercase letter, one number and one special character @$!%*?/.&`;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/.&])[A-Za-z\d@$!%/.*?&]{8,}$/;

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
