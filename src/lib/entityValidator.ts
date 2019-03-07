import { validate } from 'class-validator';
import { UserValidator } from '../models/user.validator';
import { CustomerValidator } from '../models/customer.validator';

export default (
  entity: UserValidator | CustomerValidator,
): Promise<boolean> => {
  return validate(entity).then(errors => {
    const messages = errors.map(error => error.constraints);
    return errors.length > 0 ? true : false;
  });
};
