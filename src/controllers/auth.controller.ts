import * as Koa from 'koa';
import { Repository, getRepository } from 'typeorm';
import { OK, NOT_FOUND, CREATED, BAD_REQUEST } from 'http-status-codes';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import userEntity from '../models/user.entity';
import anyFieldIsWrong from '../lib/entityValidator';
import { UserValidator } from '../models/user.validator';

export const signUp = async (ctx: Koa.Context) => {
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

export const signIn = async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const { email, password } = ctx.request.body;

  const [user] = await userRepo.find({ where: { email } });
  if (!user) throw ctx.throw(NOT_FOUND);

  const valid = await compare(password, user.password);
  if (!valid) throw ctx.throw(NOT_FOUND);

  const token = sign(
    {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    process.env.APP_SECRET,
  );

  delete user.password;
  ctx.status = OK;
  ctx.body = { token, data: { user } };
};
