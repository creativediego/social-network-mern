/**
 * Represents the filter options that can be used to filter the results of a query.
 */
export interface FilterOptions<T> {
  criteria?: Partial<T>;
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  orderBy?: string; // field name
  fields?: string[];
}

/**
 * Represents the generic operations of a DAO. The DAO acts as a layer of abstraction between the controller and the database by performing all the database-related operations.
 */
export interface IBaseDao<T> {
  findAll(options?: FilterOptions<T>): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}
