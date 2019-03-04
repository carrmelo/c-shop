import * as Router from 'koa-router';
import { authMiddleware } from '../middlewares/auth.middleware';
import { customerController } from '../controllers';

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

export { customers };
