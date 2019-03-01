import * as Koa from 'koa';
import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import customerEntity from './customer.entity';
import * as HttpStatus from 'http-status-codes';

const routerOpts: Router.IRouterOptions = {
  prefix: '/customers',
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  // Get the customer repository
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  // Find the requested customer
  const customers = await customerRepo.find();

  // Respond with the customer data
  ctx.status = HttpStatus.OK;
  ctx.body = { data: { customers } };
});

router.get('/:customer_id', async (ctx: Koa.Context) => {
  // Get the customer repository
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  // Find the requested customer
  const customer = await customerRepo.findOne(ctx.params.customer_id);

  // If there's no customer throw to Error Handler middleware
  if (!customer) {
    ctx.throw(HttpStatus.NOT_FOUND);
  }

  // Respond with customer
  ctx.status = HttpStatus.OK;
  ctx.body = { data: { customer } };
});

router.post('/', async (ctx: Koa.Context) => {
  // Get the customer repository
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const { name, surname, pictureUrl } = ctx.request.body;

  // Create the customer and save it to the DB
  const customer: customerEntity = customerRepo.create({
    name,
    surname,
    pictureUrl,
  });
  const newCustomer = await customerRepo.save(customer);

  // Respond with the created customer
  ctx.status = HttpStatus.CREATED;
  ctx.body = { data: newCustomer };
});

router.delete('/:customer_id', async (ctx: Koa.Context) => {
  // Get the customer repo
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  // Find the requested customer
  const customer = await customerRepo.findOne(ctx.params.customer_id);

  // If there's no customer throw to Error Handler middleware
  if (!customer) {
    ctx.throw(HttpStatus.NOT_FOUND);
  }

  // Delete our customer
  await customerRepo.delete(customer);

  // Respond with NO CONTENT
  ctx.status = HttpStatus.NO_CONTENT;
});

router.patch('/:customer_id', async (ctx: Koa.Context) => {
  // Get the customer repo
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  // Find the requested customer
  const customer = await customerRepo.findOne(ctx.params.customer_id);

  // If there's no customer throw to Error Handler middleware
  if (!customer) {
    ctx.throw(HttpStatus.NOT_FOUND);
  }

  // Merge the existing customer with the new data
  const updatedCustomer = await customerRepo.merge(customer, ctx.rquest.body);
  customerRepo.save(updatedCustomer);

  // Respond with ACCEPTED status and updated data
  ctx.status = HttpStatus.ACCEPTED;
  ctx.body = { data: { customer: updatedCustomer } };
});

export default router;
