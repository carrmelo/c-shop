import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as bodyParser from 'koa-bodyparser';
import * as jwt from 'koa-jwt';
import customerController from '../customer/customer.controller';
import userController from '../user/user.controller';
import authController from '../auth/auth.controller';

// Load enviroment configuration
require('dotenv').config();

const app: Koa = new Koa();

app
  .use(bodyParser())

  // Initial generic error handling middleware.
  .use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
      await next();
    } catch (error) {
      ctx.status =
        error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      error.status = ctx.status;
      ctx.body = { error };
      ctx.app.emit('error', error, ctx);
    }
  })

  // Routes middleware
  .use(authController.routes())
  .use(jwt({ secret: process.env.APP_SECRET, passthrough: true }))
  .use(customerController.routes())
  .use(userController.routes())
  .use(customerController.allowedMethods());

// Application error logging.
app.on('error', console.error);

export default app;
