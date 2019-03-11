import * as Koa from 'koa';
import { BAD_REQUEST } from 'http-status-codes';
import {
  emailRegex,
  passwordRegex,
  passwordMessage,
} from '../lib/constExports';

export const regexMiddleware = (ctx: Koa.Context, next: () => Promise<any>) => {
  // This middleware is actually doing the same job as some class-validation rules
  // Leaving it here until TODO entityValidator is done
  // so we can get specific messages for this errors
  const { email, password } = ctx.request.body;
  email &&
    ctx.assert(
      emailRegex.test(email),
      BAD_REQUEST,
      'That is not a valid email',
    );
  password &&
    ctx.assert(passwordRegex.test(password), BAD_REQUEST, passwordMessage);
  return next();
};
