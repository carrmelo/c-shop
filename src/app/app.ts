import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as bodyParser from 'koa-bodyparser';
import * as jwt from 'koa-jwt';
import customerController from '../controllers/customer.controller';
import userController from '../controllers/user.controller';
import sign from '../router';

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
  .use(sign.routes())
  .use(jwt({ secret: process.env.APP_SECRET }))
  // .use(customerController.routes())
  // .use(userController.routes())
  // .use(customerController.allowedMethods())
  .use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    await next();
  });
// Application error logging.
app.on('error', console.error);

export default app;
