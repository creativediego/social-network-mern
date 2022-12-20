import { IUser } from './IUser';

export interface IPostStats {
  replies: number;
  likes: number;
  dislikes: number;
  retuits: number;
}
export interface IPost {
  id: string;
  tuit: string;
  author: IUser;
  createdAt: string;
  image?: string;
  imageFile?: File;
  youtube?: string;
  hashtags?: string[];
  stats: IPostStats;
  likedBy: string[];
  dislikedBy: string[];
}
