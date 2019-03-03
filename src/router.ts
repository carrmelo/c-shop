import * as Koa from 'koa';
import * as Router from 'koa-router';
import {
  authController,
  // userController,
  // customerController,
} from './controllers';

const signOpts: Router.IRouterOptions = {
  prefix: '/sign',
};

const sign: Router = new Router(signOpts);

sign.post('/up', authController.signUp);

sign.post('/in', authController.signIn);

export default sign;
