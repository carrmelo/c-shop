import * as Koa from 'koa';
import { getRepository, Repository } from 'typeorm';
import {
  OK,
  NOT_FOUND,
  NO_CONTENT,
  ACCEPTED,
  FORBIDDEN,
} from 'http-status-codes';
import userEntity from '../models/user.entity';

export const getAllUsers = async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const currentUser = await userRepo.findOne(ctx.state.user.userId);

  if (!currentUser.isAdmin) {
    ctx.throw(FORBIDDEN);
  }

  const users = await userRepo.find();

  ctx.status = OK;
  ctx.body = { data: { users } };
};

export const getUser = async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const currentUser = await userRepo.findOne(ctx.state.user.userId);

  if (!currentUser.isAdmin) {
    ctx.throw(FORBIDDEN);
  }

  const user = await userRepo.findOne(ctx.params.user_id);

  if (!user) {
    ctx.throw(NOT_FOUND);
  }

  ctx.status = OK;
  ctx.body = { data: { user } };
};

export const deleteUser = async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const currentUser = await userRepo.findOne(ctx.state.user.userId);

  if (!currentUser.isAdmin) {
    ctx.throw(FORBIDDEN);
  }

  const user = await userRepo.findOne(ctx.params.user_id);

  if (!user) {
    ctx.throw(NOT_FOUND);
  }

  await userRepo.delete(user);

  ctx.status = NO_CONTENT;
};

export const editUser = async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const currentUser = await userRepo.findOne(ctx.state.user.userId);

  if (!currentUser.isAdmin) {
    ctx.throw(FORBIDDEN);
  }

  const user = await userRepo.findOne(ctx.params.user_id);

  if (!user) {
    ctx.throw(NOT_FOUND);
  }

  const updatedUser = await userRepo.merge(user, ctx.rquest.body);
  userRepo.save(updatedUser);

  ctx.status = ACCEPTED;
  ctx.body = { data: { user: updatedUser } };
};
