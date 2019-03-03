import * as Koa from 'koa';
import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import {
  OK,
  NOT_FOUND,
  CREATED,
  NO_CONTENT,
  ACCEPTED,
  getStatusText,
} from 'http-status-codes';
import customerEntity from '../customer/customer.entity';

const routerOpts: Router.IRouterOptions = {
  prefix: '/customers',
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  // TODO Authentication
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const customers = await customerRepo.find();

  ctx.status = OK;
  ctx.body = { data: { customers } };
});

router.get('/:customer_id', async (ctx: Koa.Context) => {
  // TODO Authentication
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const customer = await customerRepo.findOne(ctx.params.customer_id);

  if (!customer) {
    ctx.throw(NOT_FOUND);
  }

  ctx.status = OK;
  ctx.body = { data: { customer } };
});

router.post('/', async (ctx: Koa.Context) => {
  // TODO Authentication
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const { name, surname, pictureUrl } = ctx.request.body;
  // TODO createdBy
  const customer: customerEntity = customerRepo.create({
    name,
    surname,
    pictureUrl,
  });
  const newCustomer = await customerRepo.save(customer);

  ctx.status = CREATED;
  ctx.body = { data: newCustomer };
});

router.delete('/:customer_id', async (ctx: Koa.Context) => {
  // TODO Authentication
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const customer = await customerRepo.findOne(ctx.params.customer_id);

  if (!customer) {
    ctx.throw(NOT_FOUND);
  }

  await customerRepo.delete(customer);

  ctx.status = NO_CONTENT;
});

router.patch('/:customer_id', async (ctx: Koa.Context) => {
  // TODO Authentication
  const customerRepo: Repository<customerEntity> = getRepository(
    customerEntity,
  );

  const customer = await customerRepo.findOne(ctx.params.customer_id);

  if (!customer) {
    ctx.throw(NOT_FOUND);
  }
  // TODO lastModifiedBy
  const updatedCustomer = await customerRepo.merge(customer, ctx.rquest.body);
  customerRepo.save(updatedCustomer);

  ctx.status = ACCEPTED;
  ctx.body = { data: { customer: updatedCustomer } };
});

export default router;
