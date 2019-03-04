import { UserValidator } from '../models/user.validator';
import { validate } from 'class-validator';

export const passwordValidator = (password: string) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const bodyValidator = (user: UserValidator) => {
  validate(user).then(errors => {
    return errors.length > 0 ? true : false;
  });
};

export const emptyValidator = (field: string) => {
  const emptyRegex = /^\s*$/;
  return emptyRegex.test(field);
};

export const emailValidator = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email);
};
