import * as Koa from 'koa';
import * as Router from 'koa-router';
import authMiddleware from './middlewares/auth.middleware';
import jwt from './middlewares/jwt.middleware';
import {
  authController,
  userController,
  customerController,
} from './controllers';

// Authentication routes
const signOpts: Router.IRouterOptions = {
  prefix: '/sign',
};

const sign: Router = new Router(signOpts);

sign.post('/up', authController.signUp);
sign.post('/in', authController.signIn);

// Customers routes
const customersOpts: Router.IRouterOptions = {
  prefix: '/customers',
};

const customers: Router = new Router(customersOpts);

customers.get('/', authMiddleware, customerController.getAllCustomers);
customers.get('/:customer_id', authMiddleware, customerController.getCustomer);
customers.post('/', authMiddleware, customerController.createCustomer);
customers.delete(
  '/:customer_id',
  authMiddleware,
  customerController.deleteCustomer,
);
customers.patch(
  '/:customer_id',
  authMiddleware,
  customerController.editCustomer,
);

// Users routes
const userOpts: Router.IRouterOptions = {
  prefix: '/users',
};

const users: Router = new Router(userOpts);

users.get('/', authMiddleware, userController.getAllUsers);
users.get('/:user_id', authMiddleware, userController.getUser);
users.delete('/:user_id', authMiddleware, userController.deleteUser);
users.patch('/:user_id', authMiddleware, userController.editUser);

// Combine routers
const router: Router = new Router();

router.use(sign.routes());
router.use(customers.routes());
router.use(users.routes());

export default router;
