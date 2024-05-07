import { IPost } from '../../features/post/models/IPost';
import { FilterOptions } from './IBaseDao';

/**
 * Represents the generic operations of a DAO. The DAO acts as a layer of abstraction between the controller and the database by performing all the database-related operations.
 */
export interface IBaseService<T> {
  findAll(filter?: FilterOptions<IPost>): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}
