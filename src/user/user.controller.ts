import * as Koa from 'koa';
import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import { OK, NOT_FOUND, NO_CONTENT, ACCEPTED } from 'http-status-codes';
import { hash } from 'bcryptjs';
import userEntity from './user.entity';

const routerOpts: Router.IRouterOptions = {
  prefix: '/users',
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  // TODO Authentication
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const users = await userRepo.find();

  ctx.status = OK;
  ctx.body = { data: { users } };
});

router.get('/:user_id', async (ctx: Koa.Context) => {
  // TODO Authentication
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const user = await userRepo.findOne(ctx.params.user_id);

  if (!user) {
    ctx.throw(NOT_FOUND);
  }

  ctx.status = OK;
  ctx.body = { data: { user } };
});

router.delete('/:user_id', async (ctx: Koa.Context) => {
  // TODO Authentication
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const user = await userRepo.findOne(ctx.params.user_id);

  if (!user) {
    ctx.throw(NOT_FOUND);
  }

  await userRepo.delete(user);

  ctx.status = NO_CONTENT;
});

router.patch('/:user_id', async (ctx: Koa.Context) => {
  // TODO Authentication
  const userRepo: Repository<userEntity> = getRepository(userEntity);

  const user = await userRepo.findOne(ctx.params.user_id);

  if (!user) {
    ctx.throw(NOT_FOUND);
  }

  const updatedUser = await userRepo.merge(user, ctx.rquest.body);
  userRepo.save(updatedUser);

  ctx.status = ACCEPTED;
  ctx.body = { data: { user: updatedUser } };
});

export default router;
