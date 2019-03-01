import * as Koa from 'koa';
import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import customerEntity from './customer.entity';
import * as HttpStatus from 'http-status-codes';

const routerOpts: Router.IRouterOptions = {
  prefix: '/customers',
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  // Get the customer repository
  const customersRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  // Find the requested customer
  const customers = await customersRepo.find();

  // Respond with the customer data
  ctx.body = { data: { customers } };
});

router.get('/:customer_id', async (ctx: Koa.Context) => {
  ctx.body = 'GET SINGLE';
});

router.post('/', async (ctx: Koa.Context) => {
  ctx.body = 'POST';
});

router.delete('/:customer_id', async (ctx: Koa.Context) => {
  ctx.body = 'DELETE';
});

router.patch('/:customer_id', async (ctx: Koa.Context) => {
  ctx.body = 'GET ALL';
});

export default router;
