import { FilterOptions } from '../../../common/interfaces/IBaseDao';
import { IBaseService } from '../../../common/interfaces/IBaseService';
import { IPost } from '../models/IPost';

/**
 * Represents a service for managing CRUD operations on the 'Post' resource.
 */
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
