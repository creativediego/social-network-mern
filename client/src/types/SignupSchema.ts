import { z } from 'zod';

/**
 * SignupSchema is a zod schema for validating the signup form data.
 */
export const SignupSchema = z
  .object({
    name: z
      .string()
      .regex(
        /^[A-Za-z0-9 ,.'\\-]{3,20}$/,
        'Name should be 3-20 characters and should not include any special character!'
      ),

    username: z
      .string()
      .regex(
        /^[A-Za-z0-9]{3,16}$/,
        'Username should be 3-16 characters and should not include any special character.'
      ),
    email: z.string().email(),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        'Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type SignupSchemaT = z.infer<typeof SignupSchema>;
