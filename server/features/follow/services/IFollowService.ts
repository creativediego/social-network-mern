import { IFollow } from '../models/IFollow';

export interface IFollowService {
  createFollow(followerId: string, followeeId: string): Promise<number>;
  deleteFollow(followerId: string, followeeId: string): Promise<number>;
  findFollow(followerId: string, followeeId: string): Promise<IFollow | null>;
  acceptFollow(followerId: string, followeeId: string): Promise<IFollow | null>;
}
