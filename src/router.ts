import * as Koa from 'koa';
import * as Router from 'koa-router';
import {
  authController,
  // userController,
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

customers.get('/', customerController.getAllCustomers);
customers.get('/:customer_id', customerController.getCustomer);
customers.post('/', customerController.createCustomer);
customers.delete('/:customer_id', customerController.deleteCustomer);
customers.patch('/:customer_id', customerController.editCustomer);

const router: Router = new Router();

router.use(customers.routes());
router.use(sign.routes());

export default router;
