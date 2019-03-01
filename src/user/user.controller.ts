import * as Koa from 'koa';
import * as Router from 'koa-router';

const routerOpts: Router.IRouterOptions = {
  prefix: '/users',
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = 'GET ALL';
});

router.get('/:user_id', async (ctx: Koa.Context) => {
  ctx.body = 'GET SINGLE';
});

router.post('/', async (ctx: Koa.Context) => {
  ctx.body = 'POST';
});

router.delete('/:user_id', async (ctx: Koa.Context) => {
  ctx.body = 'DELETE';
});

router.patch('/:user_id', async (ctx: Koa.Context) => {
  ctx.body = 'GET ALL';
});

export default router;
