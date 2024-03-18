import { z } from 'zod';

export const UpdateProfileSchema = z
  .object({
    email: z.string().email(),
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

    password: z
      .string()
      .refine(
        (value) =>
          value === '' ||
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
            value
          ),
        {
          message:
            'Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!',
        }
      )
      .optional(),
    confirmPassword: z.string().optional(),
    bio: z
      .string()
      .min(0)
      .max(280, 'Bio should not exceed 280 characters.')
      .optional(),
    profilePhoto: z.instanceof(FileList).transform((list) => list.item(0)),
    // .refine(
    //   (file) => file?.size && file.size < 1 * 1024 * 1024,
    //   'Avatar image size should be less than 1MB.'
    // ),
    headerImage: z.instanceof(FileList).transform((list) => list.item(0)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

// This typs combines the types of SignupSchemaT and UpdateProfileSchemaT
export type UpdateProfileSchemaT = z.infer<typeof UpdateProfileSchema>;
