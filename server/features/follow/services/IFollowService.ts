import { IFollow } from '../models/IFollow';

/**
 * Common service interface operations for the follow related operations.
 */
export interface IFollowService {
  createFollow(followerId: string, followeeId: string): Promise<number>;
  deleteFollow(followerId: string, followeeId: string): Promise<number>;
  findFollow(followerId: string, followeeId: string): Promise<IFollow | null>;
  acceptFollow(followerId: string, followeeId: string): Promise<IFollow | null>;
}
