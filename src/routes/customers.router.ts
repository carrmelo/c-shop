import * as Router from 'koa-router';
import { authMiddleware } from '../middlewares/auth.middleware';
import pictureMiddleware from '../middlewares/picture.middleware';
import { customerController } from '../controllers';

const customersOpts: Router.IRouterOptions = {
  prefix: '/customers',
};

const customers: Router = new Router(customersOpts);

customers
  .use(authMiddleware)
  .get('/', customerController.getAllCustomers)
  .get('/:customer_id', customerController.getCustomer)
  .post('/', pictureMiddleware, customerController.createCustomer)
  .delete('/:customer_id', customerController.deleteCustomer)
  .patch('/:customer_id', pictureMiddleware, customerController.editCustomer)
  .patch('/remove-pic/:customer_id', customerController.deletePicture);

export { customers };
