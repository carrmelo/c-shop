import * as Router from 'koa-router';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { userController } from '../controllers';
import { regexMiddleware } from '../middlewares/regex.middleware';

const userOpts: Router.IRouterOptions = {
  prefix: '/users',
};

const users: Router = new Router(userOpts);

users.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
users.get('/:user_id', authMiddleware, adminMiddleware, userController.getUser);
users.delete(
  '/:user_id',
  authMiddleware,
  adminMiddleware,
  userController.deleteUser,
);
users.patch(
  '/:user_id',
  authMiddleware,
  adminMiddleware,
  regexMiddleware,
  userController.editUser,
);

export { users };
