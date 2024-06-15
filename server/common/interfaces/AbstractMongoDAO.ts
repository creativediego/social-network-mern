import { Model } from 'mongoose';
import { DatabaseError } from '../errors/DatabaseError';
import { FilterOptions, IBaseDao } from './IBaseDao';

/**
 * Abstract class that implements the IBaseDao interface. It contains common methods that interact with the database.
 */
export abstract class AbstractMongoDAO<T> implements IBaseDao<T> {
  public readonly model: Model<T>;
  private entityName: string;

  constructor(model: Model<T>, entityName: string) {
    this.model = model;
    this.entityName = entityName;
  }

  public findAll = async (options?: FilterOptions<T>): Promise<T[]> => {
    const {
      criteria,
      page = 1,
      limit = 20,
      orderBy = 'createdAt',
      order = 'desc',
      fields = [],
    } = options || {};
    try {
      return await this.model
        .find(criteria || {})
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [orderBy]: order === 'asc' ? 1 : -1 })
        .select(fields.join(' '))
        .exec();
    } catch (error) {
      throw new DatabaseError(
        `Error while finding all ${this.entityName}s.`,
        error
      );
    }
  };

  public findById = async (id: string): Promise<T | null> => {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new DatabaseError(
        `Error while finding by ID for ${this.entityName}`,
        error
      );
    }
  };

  public create = async (entity: T): Promise<T> => {
    try {
      return await this.model.create(entity);
    } catch (error) {
      throw new DatabaseError(`Error while creating ${this.entityName}`, error);
    }
  };

  public update = async (id: string, data: Partial<T>): Promise<T> => {
    try {
      const result = await this.model.findOneAndUpdate({ _id: id }, data, {
        new: true,
      });
      if (!result) {
        throw new DatabaseError(
          `Entity ${this.entityName} not found to update.`
        );
      }
      return result;
    } catch (error) {
      throw new DatabaseError(`Error while updating ${this.entityName}`, error);
    }
  };

  public delete = async (id: string): Promise<boolean> => {
    try {
      const result = await this.model.deleteOne({ _id: id }).exec();
      return result.deletedCount === 1;
    } catch (error) {
      throw new DatabaseError(`Error while deleting ${this.entityName}`, error);
    }
  };
}
