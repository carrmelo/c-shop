import * as Koa from 'koa';
import { getRepository, Repository } from 'typeorm';
import { OK, NOT_FOUND, CREATED, BAD_REQUEST } from 'http-status-codes';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import userEntity from '../models/user.entity';
import { anyFieldIsWrong } from '../lib/regexValidator';
import { UserValidator } from '../models/user.validator';

export const signUp = async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const { name, email, password, isAdmin } = ctx.request.body;

  const userValidator = new UserValidator();
  userValidator.name = name;
  userValidator.email = email;
  userValidator.password = password;

  if (await anyFieldIsWrong(userValidator)) {
    ctx.throw(BAD_REQUEST, 'Please check your user fields');
  }

  const hashPassword = await hash(password, 10);

  const user: userEntity = userRepo.create({
    name,
    isAdmin,
    email: email.toLowerCase(),
    password: hashPassword,
  });
  const newUser = await userRepo.save(user);

  // Token expiration set to 1 Hour
  const token = sign(
    {
      id: newUser.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    process.env.APP_SECRET,
  );

  delete newUser.password;
  ctx.status = CREATED;
  ctx.body = { token, data: newUser };
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
