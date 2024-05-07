import { IFollow } from '../models/IFollow';

export interface IFollowDao {
  createFollow(followerId: string, followeeId: string): Promise<IFollow>;
  deleteFollow(followerId: string, followeeId: string): Promise<IFollow | null>;
  updateFollow(
    followerId: string,
    followeeId: string,
    follow: Partial<IFollow>
  ): Promise<IFollow | null>;
  findFollow(followerId: string, followeeId: string): Promise<IFollow | null>;
}
