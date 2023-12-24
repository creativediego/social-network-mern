import { z } from 'zod';

export const SignupSchema = z
  .object({
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
