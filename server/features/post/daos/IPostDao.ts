import { IPost } from '../models/IPost';
import { FilterOptions, IBaseDao } from '../../../common/interfaces/IBaseDao';

/**
 * Additional DAO operation for the posts resource. Extends the generic {@link IBaseDao} interface.
 */
export interface IPostDao extends IBaseDao<IPost> {
  findAllPostsByAuthorId(
    userId: string,
    filter?: FilterOptions<IPost>
  ): Promise<IPost[]>;
  findAllPostsByKeyword(
    keyword: string,
    filter?: FilterOptions<IPost>
  ): Promise<IPost[]>;
  deleteManyByAuthorId(authorId: string): Promise<number>;
}
