import * as Koa from 'koa';
import { Repository, getRepository } from 'typeorm';
import {
  OK,
  NOT_FOUND,
  CREATED,
  BAD_REQUEST,
  FORBIDDEN,
} from 'http-status-codes';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import userEntity from '../models/user.entity';
import anyFieldIsWrong from '../lib/entityValidator';
import { signToken } from '../lib/jwt';

export const signUp = async (ctx: Koa.Context) => {
  // TODO Refeactor getRepository
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const [superUser] = await userRepo.find({ where: { superUser: true } });
  if (superUser) {
    throw ctx.throw(FORBIDDEN, 'A super user has already been created');
  }

  const { name, email, password } = ctx.request.body;

  let user: userEntity = userRepo.create({
    name,
    email,
    password,
    isAdmin: true,
    superUser: true,
  });

  if (await anyFieldIsWrong(user)) {
    ctx.throw(BAD_REQUEST, 'Please check your user fields');
  }

  user.password = await hash(password, 10);
  // Avoid case sensitivity on email
  user.email = email.toLowerCase();

  user = await userRepo.save(user);

  // Token expiration set to 7 days
  const token = signToken(user.id, [24, 7]);

  // Avoid send sensitive information to the client
  delete user.password;
  ctx.status = CREATED;
  ctx.body = { token, data: user };
};

export const signIn = async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const { password } = ctx.request.body;

  const email = ctx.request.body.email.toLowerCase();

  // We select the password to compare and authenticate, and the other fields to send to the client
  const [user] = await userRepo.find({
    select: ['password', 'name', 'email', 'isAdmin'],
    where: { email },
  });

  if (!user) throw ctx.throw(NOT_FOUND);

  const valid = await compare(password, user.password);
  if (!valid) throw ctx.throw(NOT_FOUND);

  // Token expiration set to 1 hour (default)
  const token = signToken(user.id);

  // Avoid send sensitive information to the client
  delete user.password;
  ctx.status = OK;
  ctx.body = { token, data: { user } };
};
