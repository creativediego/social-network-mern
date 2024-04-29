import { z } from 'zod';

const FILE_SIZE = 1024 * 1024; // 1MB

export const PostSchema = z.object({
  post: z.string().refine((post) => post.trim().length <= 280, {
    message: 'Posts must be between 0 and 280 characters',
  }),
  postImage: z
    .instanceof(FileList)
    .optional()
    .refine((fileList) => fileList && fileList[0].size <= FILE_SIZE, {
      message: 'Background file must be less than 1MB.',
    })
    .optional(),
});

export type PostSchemaT = z.infer<typeof PostSchema>;
