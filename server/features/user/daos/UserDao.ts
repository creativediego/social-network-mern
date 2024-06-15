import { Model } from 'mongoose';
import { IUser } from '../models/IUser';
import { AbstractMongoDAO } from '../../../common/interfaces/AbstractMongoDAO';
import { IUserDao } from './IUserDao';
import { DatabaseError } from '../../../common/errors/DatabaseError';

/**
 * A class representing a data access object (DAO) for user-related operations in a MongoDB database.
 */
export class UserDao extends AbstractMongoDAO<IUser> implements IUserDao {
  /**
   * Creates an instance of UserDao.
   * @param {Model<IUser>} model The Mongoose Model for the User entity.
   */
  constructor(model: Model<IUser>) {
    super(model, 'user');
    Object.freeze(this);
  }

  public findOne = async (criteria: Partial<IUser>): Promise<IUser | null> => {
    try {
      return await this.model.findOne(criteria).exec();
    } catch (error) {
      throw new DatabaseError(
        `Error while finding one user by criteria.`,
        error
      );
    }
  };

  public create = async (user: Partial<IUser>): Promise<IUser> => {
    const criteria =
      user.username && user.username
        ? { username: user.username }
        : { email: user.email };
    try {
      const dbUSer = await this.model.findOneAndUpdate(criteria, user, {
        new: true,
        upsert: true,
      });
      return dbUSer;
    } catch (error) {
      throw new DatabaseError(
        `Error while finding one user by criteria.`,
        error
      );
    }
  };

  /**
   * Finds all users that match the given keyword.
   * @param {string} keyword The keyword to search for.
   * @returns {Promise<IUser[]>} A promise that resolves to an array of users.
   */
  public async findAllUsersByKeyword(keyword: string): Promise<IUser[]> {
    try {
      return await this.model.find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { username: { $regex: keyword, $options: 'i' } },
        ],
      });
    } catch (error) {
      throw new DatabaseError(
        'Error while finding all users by keyword.',
        error
      );
    }
  }
}
