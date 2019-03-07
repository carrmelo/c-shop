import * as Router from 'koa-router';
import { authController } from '../controllers';

const sign: Router = new Router();

sign
  .post('/signup', authController.signUp)
  .post('/signin', authController.signIn);

export { sign };
