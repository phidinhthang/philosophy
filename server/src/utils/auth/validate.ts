import { User } from '../../entities/User';
import { CustomError } from '../CustomError';

export const validateLogin = (user: Partial<User>): CustomError[] => {
  const errors: CustomError[] = [];
  if (!user.name) {
    errors.push({
      field: 'username',
      message: 'Tên tài khoản không được bỏ trống.',
    });
  } else if (user.name.length < 5) {
    errors.push({
      field: 'username',
      message: 'Tên tài khoản phải chứa ít nhất 5 kí tự.',
    });
  }

  if (!user.password) {
    errors.push({
      field: 'password',
      message: 'Mật khẩu không được bỏ trống.',
    });
  }

  return errors;
};

export const validateRegister = (user: Partial<User>): CustomError[] => {
  const errors: CustomError[] = [];
  if (!user.name) {
    errors.push({
      field: 'username',
      message: 'Tên tài khoản không được bỏ trống.',
    });
  } else if (user.name.length < 5) {
    errors.push({
      field: 'username',
      message: 'Tên tài khoản phải chứa ít nhất 5 kí tự.',
    });
  }

  if (!user.password) {
    errors.push({
      field: 'password',
      message: 'Mật khẩu không được bỏ trống.',
    });
  } else if (user.password.length < 5) {
    errors.push({
      field: 'password',
      message: 'Mật khẩu phải chứa ít nhất 5 kí tự.',
    });
  }

  return errors;
};
