import * as Router from 'koa-router';

import { sign } from './auth.router';
import { customers } from './customers.router';
import { users } from './users.router';

const router: Router = new Router();

router
  .use(sign.routes())
  .use(customers.routes())
  .use(users.routes());

export default router;
