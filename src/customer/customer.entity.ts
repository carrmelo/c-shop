import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 20 })
  surname: string;

  @Column()
  pictureUrl: string;
  // Relations for created and modified
  @Column({ readonly: true })
  createdBy: string;

  @Column({ nullable: true })
  modifiedBy: string;
}
