import * as Koa from 'koa';
import {
  OK,
  NOT_FOUND,
  CREATED,
  NO_CONTENT,
  ACCEPTED,
  BAD_REQUEST,
} from 'http-status-codes';
import CustomerEntity from '../models/customer.entity';
import anyFieldIsWrong from '../lib/entityValidator';
import { deleteFile, definePicture } from '../service/upload.service';
import { FileResolved, CustomerBody } from '../lib/interfaces';
import {
  findAllCustomers,
  createOneCustomer,
  insertOneCustomer,
  findOneCustomer,
  deleteOneCustomer,
  updateOneCustomer,
} from '../service/entities.service';

export const getAllCustomers = async (ctx: Koa.Context) => {
  const customers: CustomerEntity[] = await findAllCustomers();
  ctx.status = OK;
  ctx.body = { data: { customers } };
};

export const getCustomer = async (ctx: Koa.Context) => {
  const { customer_id } = ctx.params;
  const customer: CustomerEntity = await findOneCustomer(customer_id);
  if (!customer) ctx.throw(NOT_FOUND);
  ctx.status = OK;
  ctx.body = { data: { customer } };
};

export const createCustomer = async (ctx: Koa.Context) => {
  const { picture } = ctx.request.files;
  const { name, surname } = ctx.request.body;
  const createdBy = ctx.state.user.id;

  // Construct customer body for creation
  const uploadedPicture: FileResolved = await definePicture(picture);
  const customerBody = {
    name,
    surname,
    createdBy,
    pictureUrl: uploadedPicture.url,
    pictureKey: uploadedPicture.key,
  };
  const customer: CustomerEntity = await createOneCustomer(customerBody);
  if (await anyFieldIsWrong(customer)) {
    ctx.throw(BAD_REQUEST, 'Please check your customer fields');
  }

  await insertOneCustomer(customer);
  ctx.status = CREATED;
  ctx.body = { data: customer };
};

export const deleteCustomer = async (ctx: Koa.Context) => {
  const { customer_id } = ctx.params;
  const customer: CustomerEntity = await findOneCustomer(customer_id);
  if (!customer) ctx.throw(NOT_FOUND);
  if (customer.pictureKey) await deleteFile(customer.pictureKey);
  await deleteOneCustomer(customer_id);
  ctx.status = NO_CONTENT;
};

export const editCustomer = async (ctx: Koa.Context) => {
  const { customer_id } = ctx.params;
  const customer: CustomerEntity = await findOneCustomer(customer_id);
  if (!customer) ctx.throw(NOT_FOUND);

  const { body } = ctx.request;
  const { picture } = ctx.request.files;
  if (picture) {
    const { key, url } = await definePicture(picture);
    body.pictureUrl = url;
    body.pictureKey = key;
    await deleteFile(customer.pictureKey);
  }
  body.modifiedBy = ctx.state.user.id;
  if (await anyFieldIsWrong(body)) {
    ctx.throw(BAD_REQUEST, 'Please check your customer fields');
  }

  await updateOneCustomer(body, customer_id);
  const updatedCustomer: CustomerEntity = await findOneCustomer(customer_id);
  ctx.status = ACCEPTED;
  ctx.body = { data: { customer: updatedCustomer } };
};

export const deletePicture = async (ctx: Koa.Context) => {
  const { customer_id } = ctx.params;
  const customer: CustomerEntity = await findOneCustomer(customer_id);
  if (!customer || !customer.pictureKey) ctx.throw(NOT_FOUND);
  if (customer.pictureKey) await deleteFile(customer.pictureKey);
  const customerBody: CustomerBody = {
    pictureKey: null,
    pictureUrl: null,
    modifiedBy: ctx.state.user.id,
  };
  await updateOneCustomer(customerBody, customer_id);
  const updatedCustomer: CustomerEntity = await findOneCustomer(customer_id);
  ctx.status = ACCEPTED;
  ctx.body = { data: { customer: updatedCustomer } };
};
