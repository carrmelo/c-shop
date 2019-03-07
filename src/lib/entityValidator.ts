import { validate } from 'class-validator';
import User from '../models/user.entity';
import Customer from '../models/customer.entity';

export default (entity: User | Customer): Promise<boolean> => {
  return validate(entity).then(errors => {
    console.log(errors);

    const messages = errors.map(error => error.constraints);
    return errors.length > 0 ? true : false;
  });
};
