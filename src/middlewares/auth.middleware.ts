import * as Koa from 'koa';

export default (ctx: Koa.Context, next: any) => {
  ctx.assert(ctx.state.user, 401, 'You need to log in to do this');
  return next();
};
