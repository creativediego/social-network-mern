import { IUser } from './IUser';

export interface ITuitStats {
  replies: number;
  likes: number;
  dislikes: number;
  retuits: number;
}
export interface ITuit {
  id: string;
  tuit: string;
  author: IUser;
  createdAt: string;
  image?: string;
  imageFile?: File;
  youtube?: string;
  hashtags?: string[];
  stats: ITuitStats;
  likedBy: string[];
  dislikedBy: string[];
}
