import mongoose from 'mongoose';
import { mockUser } from './mockUsers';

export const mockPosts = [
  {
    post: 'hello world!',
    author: mockUser._id,
  },
  {
    post: 'goodbye, world...',
    author: mockUser._id,
  },
];
