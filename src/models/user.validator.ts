import { IsDefined, IsEmail, MinLength, Matches } from 'class-validator';

const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export class UserValidator {
  @IsDefined()
  @MinLength(3, {
    message: 'Name is too short',
  })
  name: string;

  @IsDefined()
  @IsEmail()
  @Matches(emailRegex)
  email: string;

  @IsDefined()
  @MinLength(8, {
    message: 'Password is too short',
  })
  password: string;
}
