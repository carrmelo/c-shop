import * as Koa from 'koa';
import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import {
  OK,
  NOT_FOUND,
  CREATED,
  NO_CONTENT,
  ACCEPTED,
} from 'http-status-codes';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import userEntity from '../user/user.entity';

const routerOpts: Router.IRouterOptions = {
  prefix: '/signuser',
};

const router: Router = new Router(routerOpts);

router.post('/up', async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const { name, email, password, isAdmin } = ctx.request.body;

  const hashPassword = await hash(password, 10);

  const user: userEntity = userRepo.create({
    name,
    email: email.toLowerCase(),
    password: hashPassword,
    isAdmin: isAdmin ? true : false,
  });
  const newUser = await userRepo.save(user);

  // Token expiration set to 1 Hour
  const token = sign(
    {
      userId: newUser.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    process.env.APP_SECRET,
  );

  ctx.status = CREATED;
  ctx.body = { token, data: newUser };
});

router.post('/in', async (ctx: Koa.Context) => {
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const { email, password } = ctx.request.body;

  const [user] = await userRepo.find({ where: { email } });
  if (!user) throw ctx.throw(NOT_FOUND);

  const valid = await compare(password, user.password);
  if (!valid) throw ctx.throw(NOT_FOUND);

  const token = sign({ userId: user.id }, process.env.APP_SECRET);

  ctx.status = CREATED;
  ctx.body = { token, data: { user, lol: 'LOL' } };
});

export default router;
