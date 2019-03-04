import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsDefined } from 'class-validator';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  @IsDefined()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;
}
