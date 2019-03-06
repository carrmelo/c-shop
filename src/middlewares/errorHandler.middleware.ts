import * as Koa from 'koa';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';

export default async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.statusCode || error.status || INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit('error', error, ctx);
  }
};
