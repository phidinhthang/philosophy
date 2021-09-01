import { User } from '../../entities/User';
import { CustomError } from '../CustomError';

export const validateLogin = (user: Partial<User>): CustomError[] => {
  const errors: CustomError[] = [];
  if (!user.name) {
    errors.push({ field: 'username', message: 'username cannot be blank' });
  } else if (user.name.length < 5) {
    errors.push({
      field: 'username',
      message: 'username must be greater than 5 char',
    });
  }

  if (!user.password) {
    errors.push({ field: 'password', message: 'password cannot be blank' });
  }

  return errors;
};

export const validateRegister = (user: Partial<User>): CustomError[] => {
  const errors: CustomError[] = [];
  if (!user.name) {
    errors.push({ field: 'username', message: 'username cannot be blank' });
  } else if (user.name.length < 5) {
    errors.push({
      field: 'username',
      message: 'username must be greater than 5 char',
    });
  }

  if (!user.password) {
    errors.push({ field: 'password', message: 'password cannot be blank' });
  } else if (user.password.length < 5) {
    errors.push({
      field: 'password',
      message: 'passwort must be greater than 5 char',
    });
  }

  return errors;
};
