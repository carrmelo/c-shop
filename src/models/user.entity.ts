import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {
  IsDefined,
  IsEmail,
  MinLength,
  Matches,
  IsBoolean,
} from 'class-validator';

const passwordMessage = `Password must contain a minimum of eight characters,
at least one uppercase letter, one lowercase letter and one number`;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

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

  @Column()
  @IsDefined()
  @MinLength(8, {
    message: 'Password is too short',
  })
  @Matches(passwordRegex, { message: passwordMessage })
  password: string;

  @Column({ default: false })
  isAdmin: boolean;
}
