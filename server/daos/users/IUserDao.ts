import IUser from '../../models/users/IUser';
import IBaseDao from '../shared/IDao';

export interface IUserDao extends IBaseDao<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(value: string): Promise<IUser | null>;
  findAllByField(field: string): Promise<IUser[]>;
}
