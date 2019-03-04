import * as Router from 'koa-router';

import { sign } from './auth.router';
import { customers } from './customers.router';
import { users } from './users.router';

// Combine routers
const router: Router = new Router();

router.use(sign.routes());
router.use(customers.routes());
router.use(users.routes());

export { router };
