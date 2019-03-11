import * as Koa from 'koa';
import * as jwt from 'koa-jwt';
import * as cors from '@koa/cors';
import * as koaBody from 'koa-body';
import * as logger from 'koa-logger';
import router from '../routes';
import errorHandlerMiddleware from '../middlewares/errorHandler.middleware';

// Load enviroment configuration
require('dotenv').config();

const app: Koa = new Koa();

app
  .use(cors())
  .use(logger())
  .use(koaBody({ multipart: true }))

  // Initial generic error handling middleware.
  .use(errorHandlerMiddleware)

  // Routes middleware
  .use(jwt({ secret: process.env.APP_SECRET, passthrough: true }))
  .use(router.routes())
  .use(router.allowedMethods());

// Application error logging.
app.on('error', console.error);

export default app;
