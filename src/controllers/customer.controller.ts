import * as Koa from 'koa';
import { getRepository, Repository } from 'typeorm';
import {
  OK,
  NOT_FOUND,
  CREATED,
  NO_CONTENT,
  ACCEPTED,
  BAD_REQUEST,
} from 'http-status-codes';
import customerEntity from '../models/customer.entity';
import anyFieldIsWrong from '../lib/entityValidator';
import { uploadFile } from '../service/upload.service';

export const getAllCustomers = async (ctx: Koa.Context) => {
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const customers = await customerRepo.find({
    relations: ['createdBy', 'modifiedBy'],
  });

  ctx.status = OK;
  ctx.body = { data: { customers } };
};

export const getCustomer = async (ctx: Koa.Context) => {
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const customer = await customerRepo.findOne(ctx.params.customer_id, {
    relations: ['createdBy', 'modifiedBy'],
  });

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
  console.log(ctx);

  const { name, surname, pictureUrl } = ctx.request.body;
  const createdBy = ctx.state.user.id;

  let customer: customerEntity = customerRepo.create({
    name,
    surname,
    pictureUrl,
    createdBy,
  });

  if (await anyFieldIsWrong(customer)) {
    ctx.throw(BAD_REQUEST, 'Please check your customer fields');
  }

  customer = await customerRepo.save(customer);

  ctx.status = CREATED;
  ctx.body = { data: customer };
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

  let customer = await customerRepo.findOne(ctx.params.customer_id);

  if (!customer) {
    ctx.throw(NOT_FOUND);
  }

  const { body } = ctx.request;
  body.modifiedBy = ctx.state.user.id;

  customer = await customerRepo.merge(customer, body);

  if (await anyFieldIsWrong(customer)) {
    ctx.throw(BAD_REQUEST, 'Please check your customer fields');
  }

  await customerRepo.save(customer);

  ctx.status = ACCEPTED;
  ctx.body = { data: { customer } };
};

export const uploadPicture = async (ctx: Koa.Context) => {
  const { file } = ctx.request.files;
  const { key, url } = await uploadFile({
    fileName: file.name,
    filePath: file.path,
    fileType: file.type,
  });
  ctx.body = { key, url };
};
