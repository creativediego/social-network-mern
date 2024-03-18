import { IUser } from './IUser';

export interface IPostStats {
  replies: number;
  likes: number;
  dislikes: number;
  reposts: number;
}
export interface IPost {
  id: string;
  post: string;
  author: IUser;
  image?: string;
  imageFile?: File;
  youtube?: string;
  hashtags?: string[];
  stats: IPostStats;
  likedBy: string[];
  dislikedBy: string[];
  createdAt: string;
  updatedAt?: string;
}
