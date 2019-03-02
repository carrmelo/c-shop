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
import { hash } from 'bcryptjs';
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

  // Check email

  const user: userEntity = userRepo.create({
    name,
    email: email.toLowerCase(),
    password: hashPassword,
    isAdmin: isAdmin ? true : false,
  });
  const newUser = await userRepo.save(user);

  const token = sign({ userId: newUser.id }, process.env.APP_SECRET);
  console.log(newUser);

  ctx.status = CREATED;
  ctx.body = { data: newUser };
});

export default router;
