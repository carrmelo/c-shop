import * as Router from 'koa-router';
import { authController } from '../controllers';
import { regexMiddleware } from '../middlewares/regex.middleware';

const signOpts: Router.IRouterOptions = {
  prefix: '/sign',
};

const sign: Router = new Router(signOpts);

sign.post('/up', regexMiddleware, authController.signUp);
sign.post('/in', authController.signIn);

export { sign };
