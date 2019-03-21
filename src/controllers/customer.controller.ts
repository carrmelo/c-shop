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
import {
  uploadFile,
  deleteFile,
  definePicture,
} from '../service/upload.service';
import { FileResolved, Id } from '../lib/interfaces';
import {
  findAllCustomers,
  createOneCustomer,
  insertOneCustomer,
} from '../service/entities.service';

export const getAllCustomers = async (ctx: Koa.Context) => {
  const customers: customerEntity[] = await findAllCustomers();
  ctx.status = OK;
  ctx.body = { data: { customers } };
};

export const getCustomer = async (ctx: Koa.Context) => {
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const customer: customerEntity = await customerRepo.findOne(
    ctx.params.customer_id,
    {
      relations: ['createdBy', 'modifiedBy'],
    },
  );

  if (!customer) {
    ctx.throw(NOT_FOUND);
  }

  ctx.status = OK;
  ctx.body = { data: { customer } };
};

export const createCustomer = async (ctx: Koa.Context) => {
  const { picture } = ctx.request.files;
  const { name, surname } = ctx.request.body;
  const createdBy = ctx.state.user.id;

  // Declaration of null properties of picture in case it is not uploaded
  const uploadedPicture: FileResolved = await definePicture(picture);

  const customerBody = {
    name,
    surname,
    createdBy,
    pictureUrl: uploadedPicture.url,
    pictureKey: uploadedPicture.key,
  };

  const customer: customerEntity = await createOneCustomer(customerBody);

  if (await anyFieldIsWrong(customer)) {
    ctx.throw(BAD_REQUEST, 'Please check your customer fields');
  }

  await insertOneCustomer(customer);
  ctx.status = CREATED;
  ctx.body = { data: customer };
};

export const deleteCustomer = async (ctx: Koa.Context) => {
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const customer: customerEntity = await customerRepo.findOne(
    ctx.params.customer_id,
  );

  if (!customer) {
    ctx.throw(NOT_FOUND);
  }

  if (customer.pictureKey) {
    await deleteFile(customer.pictureKey);
  }

  await customerRepo.delete(customer);

  ctx.status = NO_CONTENT;
};

export const editCustomer = async (ctx: Koa.Context) => {
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  let customer: customerEntity = await customerRepo.findOne(
    ctx.params.customer_id,
  );

  if (!customer) {
    ctx.throw(NOT_FOUND);
  }

  const { body } = ctx.request;
  const { picture } = ctx.request.files;

  if (picture) {
    const { key, url } = await uploadFile({
      fileName: picture.name,
      filePath: picture.path,
      fileType: picture.type,
    });
    body.pictureUrl = url;
    body.pictureKey = key;
    await deleteFile(customer.pictureKey);
  }

  body.modifiedBy = ctx.state.user.id;

  customer = await customerRepo.merge(customer, body);

  if (await anyFieldIsWrong(customer)) {
    ctx.throw(BAD_REQUEST, 'Please check your customer fields');
  }

  await customerRepo.save(customer);

  ctx.status = ACCEPTED;
  ctx.body = { data: { customer } };
};

export const deletePicture = async (ctx: Koa.Context) => {
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const { customer_id }: Id = ctx.params;

  let customer: customerEntity = await customerRepo.findOne(customer_id);

  if (!customer || !customer.pictureKey) {
    ctx.throw(NOT_FOUND);
  }

  if (customer.pictureKey) {
    await deleteFile(customer.pictureKey);
  }

  await customerRepo.update(customer_id, {
    pictureKey: null,
    pictureUrl: null,
    modifiedBy: ctx.state.user.id,
  });

  customer = await customerRepo.findOne(customer_id);

  ctx.status = ACCEPTED;
  ctx.body = { data: { customer } };
};
