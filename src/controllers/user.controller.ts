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
import { sign } from 'jsonwebtoken';
import userEntity from '../models/user.entity';
import anyFieldIsWrong from '../lib/entityValidator';

export const getAllUsers = async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const users = await userRepo.find();
  const data = users.map(user => {
    const { password, ...filteredProps } = user;
    return filteredProps;
  });

  ctx.status = OK;
  ctx.body = { data };
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

export const createUser = async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const { name, email, password, isAdmin } = ctx.request.body;

  let user: userEntity = userRepo.create({
    name,
    email,
    password,
    isAdmin,
  });

  if (await anyFieldIsWrong(user)) {
    ctx.throw(BAD_REQUEST, 'Please check your user fields');
  }

  user.password = await hash(password, 10);
  user.email = email.toLowerCase();

  user = await userRepo.save(user);

  // Token expiration set to 1 Hour
  const token = sign(
    {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    process.env.APP_SECRET,
  );

  delete user.password;
  ctx.status = CREATED;
  ctx.body = { token, data: user };
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
