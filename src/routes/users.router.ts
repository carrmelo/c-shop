import * as Router from 'koa-router';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { userController } from '../controllers';
import { regexMiddleware } from '../middlewares/regex.middleware';

const userOpts: Router.IRouterOptions = {
  prefix: '/users',
};

const users: Router = new Router(userOpts);

users
  .use(authMiddleware, adminMiddleware)
  .get('/', userController.getAllUsers)
  .get('/:user_id', userController.getUser)
  .post('/', regexMiddleware, userController.createUser)
  .delete('/:user_id', userController.deleteUser)
  .patch('/:user_id', regexMiddleware, userController.editUser);

export { users };
