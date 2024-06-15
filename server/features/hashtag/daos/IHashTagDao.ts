import { IBaseDao } from '../../../common/interfaces/IBaseDao';
import { IHashtag } from '../models/IHashtag';

/**
 * Database operations for the hashtag feature.
 */
export interface IHashtagDao extends IBaseDao<IHashtag> {
  deleteManyByPostId(postId: string): Promise<number>;
}
