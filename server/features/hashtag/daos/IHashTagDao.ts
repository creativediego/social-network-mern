import { IBaseDao } from '../../../common/interfaces/IBaseDao';
import { IHashtag } from '../models/IHashtag';

export interface IHashtagDao extends IBaseDao<IHashtag> {
  deleteManyByPostId(postId: string): Promise<number>;
}
