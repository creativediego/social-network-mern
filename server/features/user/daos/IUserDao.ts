import { IUser } from '../models/IUser';
import { IBaseDao } from '../../../common/interfaces/IBaseDao';

/**
 * Data access object for the user resource. Extends {@link IBaseDao}.
 */
export interface IUserDao extends IBaseDao<IUser> {
  findAllUsersByKeyword(keyword: string): Promise<IUser[]>;
  findOne(criteria: Partial<IUser>): Promise<IUser | null>;
}
