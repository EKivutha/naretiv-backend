import { number, object, string, TypeOf, z } from 'zod';
import { RoleEnumType } from '../entity/user';

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }),
    email: string({
      required_error: 'Email address is required',
    }).email('Invalid email address'),
    password: string({
      required_error: 'Password is required',
    })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({
      required_error: 'Please confirm your password',
    }),
    age:number({
      required_error: 'Enter age',
    }),
    role: z.optional(z.nativeEnum(RoleEnumType)),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email address is required',
    }).email('Invalid email address'),
    password: string({
      required_error: 'Password is required',
    }).min(8, 'Invalid email or password'),
  }),
});

export const verifyEmailSchema = object({
  params:object({
    verificationCode: string(),
  })
});

export type VerifyEmailInput = TypeOf<typeof verifyEmailSchema>['params']

export type createUserInput = Omit<
  TypeOf<typeof createUserSchema>['body'],
  'passwordConfirm'
>;

export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];

const params = {
  params: object({
      userId: string(),
  })
};

export const getUserSchema = object({
  ...params
});

export const updateUserSchema = object({
  ...params,
  body: object({
    account_balance:number()
  }).partial(),
});

export const deleteUserSchema = object({
  ...params,
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type GetUserInput = TypeOf<typeof getUserSchema>['params'];
export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>['params'];