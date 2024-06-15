import { AbstractMongoDAO } from '../../../common/interfaces/AbstractMongoDAO';
import { IHashtag } from '../models/IHashtag';
import { Model } from 'mongoose';
import { IHashtagDao } from './IHashTagDao';
import { DatabaseError } from '../../../common/errors/DatabaseError';

/**
 * Database operations for the hashtag feature. Takes a mongoose hashtag model as a dependency.
 */
export class HashTagDao
  extends AbstractMongoDAO<IHashtag>
  implements IHashtagDao
{
  public constructor(hashtagModel: Model<IHashtag>) {
    super(hashtagModel, 'hashtag');
    Object.freeze(this);
  }

  public deleteManyByPostId = async (postId: string): Promise<number> => {
    try {
      const { deletedCount } = await this.model.deleteMany({ post: postId });
      return deletedCount;
    } catch (error) {
      throw new DatabaseError(
        `Error while deleting hashtags by post ID: ${postId}`
      );
    }
  };
}
