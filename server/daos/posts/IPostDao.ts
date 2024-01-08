import IPost from '../../models/posts/IPost';
import IBaseDao from '../shared/IDao';

/**
 * Additional DAO operation for the posts resource. Extends the generic {@link IBaseDao} interface.
 */
export default interface IPostDao extends IBaseDao<IPost> {
  findByUser(uid: string): Promise<IPost[]>;
}
