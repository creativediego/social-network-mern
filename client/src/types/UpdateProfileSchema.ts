import { z } from 'zod';

const FILE_SIZE = 1048576; // 1MB

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
    profilePhoto: z
      .instanceof(FileList)
      .optional()
      .refine((fileList) => fileList && fileList.length > 0, {
        message: 'Please upload an avatar image.',
      })
      .optional()
      .refine((fileList) => !fileList || fileList[0].size <= FILE_SIZE, {
        message: 'Avatar file must be less than 1MB.',
      }),
    headerImage: z
      .instanceof(FileList)
      .optional()
      .refine((fileList) => fileList && fileList[0].size <= FILE_SIZE, {
        message: 'Background file must be less than 1MB.',
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

// This typs combines the types of SignupSchemaT and UpdateProfileSchemaT
export type UpdateProfileSchemaT = z.infer<typeof UpdateProfileSchema>;
