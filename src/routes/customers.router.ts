import * as Router from 'koa-router';
import { authMiddleware } from '../middlewares/auth.middleware';
import pictureMiddleware from '../middlewares/picture.middleware';
import { customerController } from '../controllers';

const customersOpts: Router.IRouterOptions = {
  prefix: '/customers',
};

const customers: Router = new Router(customersOpts);

customers
  .get('/', authMiddleware, customerController.getAllCustomers)
  .get('/:customer_id', authMiddleware, customerController.getCustomer)
  .post(
    '/',
    authMiddleware,
    pictureMiddleware,
    customerController.createCustomer,
  )
  .delete('/:customer_id', authMiddleware, customerController.deleteCustomer)
  .patch(
    '/:customer_id',
    authMiddleware,
    pictureMiddleware,
    customerController.editCustomer,
  )
  .patch(
    '/remove-pic/:customer_id',
    authMiddleware,
    customerController.deletePicture,
  );

export { customers };
