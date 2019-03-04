import * as Koa from 'koa';
import { UNAUTHORIZED } from 'http-status-codes';

export const authMiddleware = (ctx: Koa.Context, next: () => Promise<any>) => {
  ctx.assert(ctx.state.user, UNAUTHORIZED);
  return next();
};
