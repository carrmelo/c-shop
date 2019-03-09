import { validate } from 'class-validator';
import User from '../models/user.entity';
import Customer from '../models/customer.entity';

export default (entity: User | Customer): Promise<boolean> => {
  // tslint:disable-next-line: ter-arrow-parens
  return validate(entity).then(errors => {
    const messages = errors.map(error => error.constraints);
    return errors.length > 0 ? true : false;
  });
};
