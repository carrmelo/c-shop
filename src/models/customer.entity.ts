import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsDefined, MinLength } from 'class-validator';

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

  @Column()
  pictureUrl: string;
  // Relations for created and modified
  @Column({ readonly: true })
  createdBy: string;

  @Column({ nullable: true })
  modifiedBy: string;
}
