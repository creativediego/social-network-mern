/**
 * Represents the generic operations of a DAO. The DAO acts as a layer of abstraction between the controller and the database by performing all the database-related operations.
 */
export default interface IBaseDao<T> {
  findAll(criteria?: Partial<T>): Promise<T[]>;
  findOneById(id: string): Promise<T | null>;
  findOne(criteria: Partial<T>): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<boolean>;
}
