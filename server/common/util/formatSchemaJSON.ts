import { Schema } from 'mongoose';

export const formatSchemaJSON = (schema: Schema): void => {
  schema.set('toJSON', {
    getters: true,
    virtuals: true,
    transform: (doc, ret, options) => {
      delete ret.__v;
      ret.id = ret._id.toString();
      delete ret._id;
      if (ret.birthday) ret.birthday = ret.birthday.toISOString().split('T')[0];
      ret.updatedAt = ret.updatedAt.toISOString().split('T')[0];
    },
  });
};
