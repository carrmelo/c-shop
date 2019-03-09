import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { IsDefined, MinLength } from 'class-validator';
import User from './user.entity';
@Entity()
export default class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  @IsDefined()
  @MinLength(3, {
    message: 'Name is too short',
  })
  name: string;

  @Column({ length: 20 })
  @IsDefined()
  @MinLength(3, {
    message: 'Name is too short',
  })
  surname: string;

  @Column({ nullable: true })
  pictureUrl: string;

  @Column({ nullable: true })
  pictureKey: string;

  @ManyToOne(type => User, user => user.created)
  createdBy: User;

  @ManyToOne(type => User, user => user.modified)
  modifiedBy: User;
}
