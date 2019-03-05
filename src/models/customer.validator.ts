import { IsDefined, IsEmail, MinLength } from 'class-validator';

export class CustomerValidator {
  @IsDefined()
  @MinLength(3, {
    message: 'Name is too short',
  })
  name: string;

  @IsDefined()
  @MinLength(3, {
    message: 'Name is too short',
  })
  surname: string;
}
