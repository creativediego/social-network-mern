/**
 * A class representing a data access object (DAO) for user-related operations in a MongoDB database.
 */
import IBaseDao from '../shared/IDao';
import { Model } from 'mongoose';
import IUser from '../../models/users/IUser';
import { DatabaseError } from '../../errors/DatabaseError';

export default class UserDao implements IBaseDao<IUser> {
  private readonly model: Model<IUser>;

  /**
   * Creates an instance of UserDao.
   * @param {Model<IUser>} model The Mongoose Model for the User entity.
   */
  constructor(model: Model<IUser>) {
    this.model = model;
    Object.freeze(this);
  }

  /**
   * Finds one user in the database based on the provided criteria.
   * @param {Partial<IUser>} criteria The criteria to search for the user.
   * @returns {Promise<IUser | null>} A Promise that resolves to the found user or null if not found.
   * @throws {DatabaseError} If an error occurs during the operation.
   */
  findOne = async (criteria: Partial<IUser>): Promise<IUser | null> => {
    try {
      return this.model.findOne(criteria || {});
    } catch (error) {
      throw new DatabaseError('Error finding user.', error);
    }
  };

  /**
   * Finds all users in the database based on the provided criteria.
   * @param {Partial<IUser>} [criteria] The optional criteria to filter the users.
   * @returns {Promise<IUser[]>} A Promise that resolves to an array of users matching the criteria.
   * @throws {DatabaseError} If an error occurs during the operation.
   */
  findAll = async (criteria?: Partial<IUser>): Promise<IUser[]> => {
    try {
      return await this.model.find(criteria || {});
    } catch (error) {
      throw new DatabaseError('Error finding users.', error);
    }
  };

  /**
   * Finds a single user in the database by its specified id.
   * @param {string} id The id of the user.
   * @returns {Promise<IUser | null>} A Promise that resolves to the found user or null if not found.
   * @throws {DatabaseError} If an error occurs during the operation.
   */
  findOneById = async (id: string): Promise<IUser | null> => {
    try {
      return await this.model.findOne({ _id: id });
    } catch (err) {
      throw new DatabaseError('Error finding user.', err);
    }
  };

  /**
   * Creates a new user document in the database.
   * @param {IUser} user The new user object to be created.
   * @returns {Promise<IUser>} A Promise that resolves to the newly created user.
   * @throws {DatabaseError} If an error occurs during the operation.
   */
  create = async (user: IUser): Promise<IUser> => {
    try {
      // If user already exists, return the existing user.
      const existingUser = await this.model.findOne({
        uid: user?.uid,
        email: user.email,
      });
      if (existingUser) {
        return existingUser;
      }
      // Otherwise, create a new user.
      const newUser: IUser = await this.model.create({ ...user });
      return newUser;
    } catch (err) {
      throw new DatabaseError('Error creating user.', err);
    }
  };

  /**
   * Updates a user in the database by its id.
   * @param {string} id The id of the user to update.
   * @param {IUser} user The user object containing the information for the update.
   * @returns {Promise<IUser>} A Promise that resolves to the updated user.
   * @throws {DatabaseError} If an error occurs during the operation or if the user is not found.
   */
  update = async (id: string, user: IUser): Promise<IUser> => {
    try {
      const updatedUser: IUser | null = await this.model.findOneAndUpdate(
        { _id: id },
        { ...user },
        {
          new: true,
        }
      );
      if (!updatedUser) {
        throw new DatabaseError('User not found for update operation.');
      }
      return updatedUser;
    } catch (err) {
      throw new DatabaseError('Error updating user.', err);
    }
  };

  /**
   * Deletes a particular user from the database by its id.
   * @param {string} userId The id of the user to be deleted.
   * @returns {Promise<boolean>} A Promise that resolves to true if the user was successfully deleted, false otherwise.
   * @throws {DatabaseError} If an error occurs during the operation or if the user is not found.
   */
  delete = async (userId: string): Promise<boolean> => {
    try {
      const existingUser = await this.model.findOne({ _id: userId });
      if (existingUser === null) {
        throw new DatabaseError('User not found.');
      }
      const userToDelete = await this.model.deleteOne({ _id: userId });
      return userToDelete.acknowledged;
    } catch (err) {
      throw new DatabaseError('Error deleting user.', err);
    }
  };
}
