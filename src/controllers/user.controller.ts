import * as Koa from 'koa';
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
  deleteOneUser,
  updateOneUser,
} from '../service/entities.service';

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

  // Token expiration set to 1 Hour (default)
  const token = signToken(user.id);

  delete user.password;
  delete user.superUser;
  ctx.status = CREATED;
  ctx.body = { token, data: user };
};

export const deleteUser = async (ctx: Koa.Context) => {
  const { user_id } = ctx.params;
  const user: UserEntity = await findOneUser(user_id);
  if (!user) ctx.throw(NOT_FOUND);
  await deleteOneUser(user_id);
  ctx.status = NO_CONTENT;
};

export const editUser = async (ctx: Koa.Context) => {
  const { user_id } = ctx.params;
  const user: UserEntity = await findOneUser(user_id);
  if (!user) ctx.throw(NOT_FOUND);
  const { body } = ctx.request;
  if (await anyFieldIsWrong(body)) {
    ctx.throw(BAD_REQUEST, 'Please check your user fields');
  }
  if (body.password) body.password = await hash(body.password, 10);
  if (body.email) body.email = body.email.toLowerCase();
  await updateOneUser(body, user_id);
  const updatedUser: UserEntity = await findOneUser(user_id);
  ctx.status = ACCEPTED;
  ctx.body = { data: { user: updatedUser } };
};
