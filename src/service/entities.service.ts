import { Repository, getRepository, getConnection } from 'typeorm';
import UserEntity from '../models/user.entity';
import CustomerEntity from '../models/customer.entity';
import { CustomerBody } from '../lib/interfaces';

// TODO solve typing of entities at parameters to refactor User and Customer in One
export const findOneUser = async (id: string) => {
  const user: UserEntity = await getRepository(UserEntity)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.created', 'createdBy')
    .leftJoinAndSelect('user.modified', 'modifiedBy')
    .where('user.id = :id', { id })
    .getOne();

  return user;
};
// TODO solve typing of entities at parameters to refactor User and Customer in One
export const findOneCustomer = async (id: string) => {
  const customer: CustomerEntity = await getRepository(CustomerEntity)
    .createQueryBuilder('customer')
    .leftJoinAndSelect('customer.createdBy', 'created')
    .leftJoinAndSelect('customer.modifiedBy', 'modified')
    .where('customer.id = :id', { id })
    .getOne();

  return customer;
};
// TODO solve typing of entities at parameters to refactor User and Customer in One
export const findAllUsers = async () => {
  const users: UserEntity[] = await getRepository(UserEntity)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.created', 'createdBy')
    .leftJoinAndSelect('user.modified', 'modifiedBy')
    .getMany();

  return users;
};
// TODO solve typing of entities at parameters to refactor User and Customer in One
export const findAllCustomers = async () => {
  const customers: CustomerEntity[] = await getRepository(CustomerEntity)
    .createQueryBuilder('customer')
    .leftJoinAndSelect('customer.createdBy', 'created')
    .leftJoinAndSelect('customer.modifiedBy', 'modified')
    .getMany();

  return customers;
};
// TODO solve typing of entities at parameters to refactor User and Customer in One
export const createOneUser = (userBody: UserEntity) => {
  const userRepo: Repository<UserEntity> = getRepository(UserEntity);
  const user: UserEntity = userRepo.create(userBody);
  return user;
};
// TODO solve typing of entities at parameters to refactor User and Customer in One
export const createOneCustomer = (customerBody: CustomerBody) => {
  const customerRepo: Repository<CustomerEntity> = getRepository(
    CustomerEntity,
  );
  const customer: CustomerEntity = customerRepo.create(customerBody);
  return customer;
};
// TODO solve typing of entities at parameters to refactor User and Customer in One
export const insertOneUser = async (newUser: UserEntity) => {
  await getRepository(UserEntity)
    .createQueryBuilder()
    .insert()
    .into(UserEntity)
    .values(newUser)
    .execute();
};
// TODO solve typing of entities at parameters to refactor User and Customer in One
export const insertOneCustomer = async (newCustomer: CustomerEntity) => {
  await getRepository(CustomerEntity)
    .createQueryBuilder()
    .insert()
    .into(CustomerEntity)
    .values(newCustomer)
    .execute();
};
// TODO solve typing of entities at parameters to refactor User and Customer in One
export const deleteOneUser = async (id: string) => {
  await getRepository(UserEntity)
    .createQueryBuilder()
    .delete()
    .from(UserEntity)
    .where('id = :id', { id })
    .execute();
};
// TODO solve typing of entities at parameters to refactor User and Customer in One
export const deleteOneCustomer = async (id: string) => {
  await getRepository(CustomerEntity)
    .createQueryBuilder()
    .delete()
    .from(CustomerEntity)
    .where('id = :id', { id })
    .execute();
};
// TODO solve typing of entities at parameters to refactor User and Customer in One
export const updateOneUser = async (updatedFields: any, id: string) => {
  await getRepository(UserEntity)
    .createQueryBuilder()
    .update(UserEntity)
    .set(updatedFields)
    .where('id = :id', { id })
    .execute();
};
// TODO solve typing of entities at parameters to refactor User and Customer in One
export const updateOneCustomer = async (updatedFields: any, id: string) => {
  await getRepository(CustomerEntity)
    .createQueryBuilder()
    .update(CustomerEntity)
    .set(updatedFields)
    .where('id = :id', { id })
    .execute();
};
