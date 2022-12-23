import IPost from '../../models/posts/IPost';
import IDao from '../shared/IDao';

/**
 * Additional DAO operation for the posts resource. Extends the generic {@link IDao} interface.
 */
export default interface IPostDao extends IDao<IPost> {
  findByUser(uid: string): Promise<IPost[]>;
}
