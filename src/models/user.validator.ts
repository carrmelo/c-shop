import { IsDefined, IsEmail, MinLength, Matches } from 'class-validator';

export class UserValidator {
  @IsDefined()
  @MinLength(3, {
    message: 'Name is too short',
  })
  name: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @MinLength(8, {
    message: 'Password is too short',
  })
  password: string;
}
