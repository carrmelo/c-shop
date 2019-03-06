import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as bodyParser from 'koa-bodyparser';
import * as jwt from 'koa-jwt';
import router from '../routes';
import errorHandlerMiddleware from '../middlewares/errorHandler.middleware';

// Load enviroment configuration
require('dotenv').config();

const app: Koa = new Koa();

app
  .use(bodyParser())

  // Initial generic error handling middleware.
  .use(errorHandlerMiddleware)

  // Routes middleware
  .use(jwt({ secret: process.env.APP_SECRET, passthrough: true }))
  .use(router.routes())
  .use(router.allowedMethods());

// Application error logging.
app.on('error', console.error);

export default app;
