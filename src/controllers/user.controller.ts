import * as Koa from 'koa';
import { getRepository, Repository } from 'typeorm';
import {
  OK,
  NOT_FOUND,
  NO_CONTENT,
  ACCEPTED,
  getStatusText,
} from 'http-status-codes';
import userEntity from '../models/user.entity';

export const getAllUsers = async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const users = await userRepo.find();
  users.map(user => delete user.password);

  ctx.status = OK;
  ctx.body = { data: { users } };
};

export const getUser = async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const user = await userRepo.findOne(ctx.params.user_id);

  if (!user) {
    ctx.throw(NOT_FOUND);
  }

  delete user.password;
  ctx.status = OK;
  ctx.body = { data: { user } };
};

export const deleteUser = async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const user = await userRepo.findOne(ctx.params.user_id);

  if (!user) {
    ctx.throw(NOT_FOUND);
  }

  await userRepo.delete(user);

  ctx.status = NO_CONTENT;
};

export const editUser = async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const user = await userRepo.findOne(ctx.params.user_id);

  if (!user) {
    ctx.throw(NOT_FOUND);
  }

  const updatedUser = await userRepo.merge(user, ctx.request.body);
  userRepo.save(updatedUser);
  delete updatedUser.password;
  ctx.status = ACCEPTED;
  ctx.body = { data: { user: updatedUser } };
};
