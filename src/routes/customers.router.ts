import * as Router from 'koa-router';
import { authMiddleware } from '../middlewares/auth.middleware';
import { customerController } from '../controllers';
import { uploadPicture } from '../controllers/customer.controller';
// import { upload } from '../service/upload.service';

const customersOpts: Router.IRouterOptions = {
  prefix: '/customers',
};

const customers: Router = new Router(customersOpts);

// const singleUpload = upload.single('image');

customers
  .get('/', authMiddleware, customerController.getAllCustomers)
  .get('/:customer_id', authMiddleware, customerController.getCustomer)
  .post('/', authMiddleware, customerController.createCustomer)
  .delete('/:customer_id', authMiddleware, customerController.deleteCustomer)
  .patch('/:customer_id', authMiddleware, customerController.editCustomer)
  .post('/picture', authMiddleware, customerController.uploadPicture);

export { customers };
