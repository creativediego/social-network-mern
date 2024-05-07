import mongoose from 'mongoose';
import { IPost } from '../../features/post/models/IPost';
import { mockUsers } from './mockUsers';

const mockUser = mockUsers[0];

export const mockPosts: IPost[] = [
  {
    id: '1',
    post: 'post 1',
    author: mockUsers[0],
    stats: {
      likes: 0,
      dislikes: 0,
      replies: 0,
      reposts: 0,
    },
    likedBy: [],
    dislikedBy: [],
    hashtags: [],
  },
  {
    id: '2',
    post: 'post 2',
    author: mockUsers[0],
    stats: {
      likes: 0,
      dislikes: 0,
      replies: 0,
      reposts: 0,
    },
    likedBy: [],
    dislikedBy: [],
    hashtags: [],
  },
  {
    id: '3',
    post: 'post 3',
    author: mockUsers[1],
    stats: {
      likes: 0,
      dislikes: 0,
      replies: 0,
      reposts: 0,
    },
    likedBy: [],
    dislikedBy: [],
    hashtags: [],
  },
  {
    id: '4',
    post: 'post 4',
    author: mockUsers[1],
    stats: {
      likes: 0,
      dislikes: 0,
      replies: 0,
      reposts: 0,
    },
    likedBy: [],
    dislikedBy: [],
    hashtags: [],
  },
];
