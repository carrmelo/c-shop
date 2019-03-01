import * as Koa from 'koa';
import * as Router from 'koa-router';

const routerOpts: Router.IRouterOptions = {
  prefix: '/customers',
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = 'GET ALL';
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
