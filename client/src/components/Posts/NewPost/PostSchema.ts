import { z } from 'zod';

const FILE_SIZE = 1024 * 1024; // 1MB

/**
 * `PostSchema` is a Zod schema for validating post data.
 * It includes a `post` field, which must be a string of 280 characters or less, and an optional `postImage` field, which must be a `FileList` with a file of 1MB or less.
 *
 * @see {@link z} for the Zod library used to create the schema.
 * @see {@link PostSchemaT} for the type inferred from the schema.
 */
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
