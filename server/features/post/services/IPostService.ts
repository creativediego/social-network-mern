import { FilterOptions } from '../../../common/interfaces/IBaseDao';
import { IBaseService } from '../../../common/interfaces/IBaseService';
import { IPost } from '../models/IPost';

export interface IPostService extends IBaseService<IPost> {
  findAllPostsByKeyword(
    keyword: string,
    filter?: FilterOptions<IPost>
  ): Promise<IPost[]>;
  findAllPostsByAuthorId(
    userId: string,
    filter?: FilterOptions<IPost>
  ): Promise<IPost[]>;
}
