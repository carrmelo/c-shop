import * as Koa from 'koa';
import { getRepository, Repository } from 'typeorm';
import {
  OK,
  NOT_FOUND,
  NO_CONTENT,
  ACCEPTED,
  BAD_REQUEST,
  CREATED,
} from 'http-status-codes';
import { hash } from 'bcryptjs';
import UserEntity from '../models/user.entity';
import anyFieldIsWrong from '../lib/entityValidator';
import { signToken } from '../lib/jwt';
import {
  findOneUser,
  findAllUsers,
  insertOneUser,
  createOneUser,
} from '../service/user.service';
import { create } from 'domain';

export const getAllUsers = async (ctx: Koa.Context) => {
  const users: UserEntity[] = await findAllUsers();

  ctx.status = OK;
  ctx.body = { data: users };
};

export const getUser = async (ctx: Koa.Context) => {
  const user: UserEntity = await findOneUser(ctx.params.user_id);

  if (!user) ctx.throw(NOT_FOUND);

  ctx.status = OK;
  ctx.body = { data: { user } };
};

export const createUser = async (ctx: Koa.Context) => {
  const { email, password }: UserEntity = ctx.request.body;

  const user: UserEntity = createOneUser(ctx.request.body);

  if (await anyFieldIsWrong(user)) {
    ctx.throw(BAD_REQUEST, 'Please check your user fields');
  }

  user.password = await hash(password, 10);
  user.email = email.toLowerCase();

  await insertOneUser(user);
  // user = await userRepo.save(user);

  // Token expiration set to 1 Hour (default)
  const token = signToken(user.id);

  delete user.password;
  delete user.superUser;
  ctx.status = CREATED;
  ctx.body = { token, data: user };
};

export const deleteUser = async (ctx: Koa.Context) => {
  const user: UserEntity = await findOneUser(ctx.params.user_id);

  if (!user) {
    ctx.throw(NOT_FOUND);
  }

  // await userRepo.delete(user);

  ctx.status = NO_CONTENT;
};

export const editUser = async (ctx: Koa.Context) => {
  let user: UserEntity = await findOneUser(ctx.params.user_id);

  const { body } = ctx.request;

  if (!user) {
    ctx.throw(NOT_FOUND);
  }

  // user = await userRepo.merge(user, body);

  if (await anyFieldIsWrong(user)) {
    ctx.throw(BAD_REQUEST, 'Please check your customer fields');
  }

  if (body.password) user.password = await hash(body.password, 10);
  if (body.email) user.email.toLowerCase();

  // userRepo.save(user);
  ctx.status = ACCEPTED;
  ctx.body = { data: { user } };
};
