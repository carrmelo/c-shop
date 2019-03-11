import { validate } from 'class-validator';
import User from '../models/user.entity';
import Customer from '../models/customer.entity';

export default (entity: User | Customer): Promise<boolean> => {
  // tslint:disable-next-line: ter-arrow-parens
  return validate(entity).then(errors => {
    const [message] = errors.map(error => error.constraints);
    console.log({ message });
    // TODO return message to print to user instead of boolean
    return errors.length > 0 ? true : false;
  });
};
