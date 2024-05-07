import { IUser } from '../models/IUser';
import { IBaseDao } from '../../../common/interfaces/IBaseDao';

export interface IUserDao extends IBaseDao<IUser> {
  findAllUsersByKeyword(keyword: string): Promise<IUser[]>;
  findOne(criteria: Partial<IUser>): Promise<IUser | null>;
}
