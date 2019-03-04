import * as Koa from 'koa';
import { CONFLICT } from 'http-status-codes';

export const regexMiddleware = (ctx: Koa.Context, next: () => Promise<any>) => {
  const { email, password } = ctx.request.body;
  const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  ctx.assert(emailRegex.test(email), CONFLICT, 'That is not a valid email');
  ctx.assert(
    passwordRegex.test(password),
    CONFLICT,
    'Password must contain a minimum of eight characters, at least one uppercase letter, one lowercase letter and one number',
  );
  return next();
};
