import * as Koa from 'koa';
import { getRepository, Repository } from 'typeorm';
import {
  OK,
  NOT_FOUND,
  CREATED,
  NO_CONTENT,
  ACCEPTED,
} from 'http-status-codes';
import customerEntity from '../models/customer.entity';

export const getAllCustomers = async (ctx: Koa.Context) => {
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const customers = await customerRepo.find();

  ctx.status = OK;
  ctx.body = { data: { customers } };
};

export const getCustomer = async (ctx: Koa.Context) => {
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const customer = await customerRepo.findOne(ctx.params.customer_id);

  if (!customer) {
    ctx.throw(NOT_FOUND);
  }

  ctx.status = OK;
  ctx.body = { data: { customer } };
};

export const createCustomer = async (ctx: Koa.Context) => {
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const { name, surname, pictureUrl } = ctx.request.body;
  const createdBy = ctx.state.user.id;

  const customer: customerEntity = customerRepo.create({
    name,
    surname,
    pictureUrl,
    createdBy,
  });
  const newCustomer = await customerRepo.save(customer);

  ctx.status = CREATED;
  ctx.body = { data: newCustomer };
};

export const deleteCustomer = async (ctx: Koa.Context) => {
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const customer = await customerRepo.findOne(ctx.params.customer_id);

  if (!customer) {
    ctx.throw(NOT_FOUND);
  }

  await customerRepo.delete(customer);

  ctx.status = NO_CONTENT;
};

export const editCustomer = async (ctx: Koa.Context) => {
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const customer = await customerRepo.findOne(ctx.params.customer_id);

  if (!customer) {
    ctx.throw(NOT_FOUND);
  }

  ctx.request.body.modifiedBy = ctx.state.user.id;

  const updatedCustomer = await customerRepo.merge(customer, ctx.request.body);
  customerRepo.save(updatedCustomer);

  ctx.status = ACCEPTED;
  ctx.body = { data: { customer: updatedCustomer } };
};
