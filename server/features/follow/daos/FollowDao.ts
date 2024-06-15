import { Model } from 'mongoose';
import { IFollow } from '../models/IFollow';
import { IFollowDao } from './IFollowDao';
import { DatabaseError } from '../../../common/errors/DatabaseError';

/**
 * Database operations for the follow feature between users. Takes a mongoose follow model and error handler as a dependency.
 */
export default class FollowDao implements IFollowDao {
  private readonly followModel: Model<IFollow>;

  /**
   * Constructs the DAO with a follow model and error handler.
   * @param {Model<IFollow>} followModel the mongoose bookmark model
   * @param {IErrorHandler} errorHandler the error handler for all errors
   */
  public constructor(followModel: Model<IFollow>) {
    this.followModel = followModel;
    Object.freeze(this);
  }

  /**
   * Creates a follow document with the provided follower and followee ids.
   * @param {string} follower
   * @param {string} followee
   * @returns {Promise<IFollow>} the new follow promise document
   */
  createFollow = async (
    follower: string,
    followee: string
  ): Promise<IFollow> => {
    try {
      const follow = await this.followModel.findOneAndUpdate(
        {
          follower,
          followee,
        },
        {},
        { upsert: true, new: true }
      );
      return await follow.populate('followee');
    } catch (err) {
      throw new DatabaseError('Error while creating follow.', err);
    }
  };

  /**
   * Deletes a follow document with the provided follower and followee ids.
   * @param {string} follower
   * @param {string} followee
   * @returns {Promise<IFollow>} the deleted follow promise document
   */
  deleteFollow = async (
    follower: string,
    followee: string
  ): Promise<IFollow | null> => {
    try {
      const deletedFollow = await this.followModel.findOneAndDelete({
        follower: follower,
        followee: followee,
      });
      return deletedFollow;
    } catch (err) {
      throw new DatabaseError('Error while deleting follow.', err);
    }
  };

  /**
   * Update a follow document by changing the accepted field to true using the id of the user who is being followed and the id of the follow document.
   * @param {string} followerId the id of the user being followed who is accepting the follow request
   * @param {string} followeeId the id of the follow document
   * @returns {Promise<IFollow>} the updated follow document
   */
  updateFollow = async (
    followerId: string,
    followeeId: string,
    follow: Partial<IFollow>
  ): Promise<IFollow | null> => {
    try {
      const updatedFollow = await this.followModel.findOneAndUpdate(
        {
          follower: followerId,
          followee: followeeId,
        },
        follow,
        { new: true }
      );
      return updatedFollow;
    } catch (err) {
      throw new DatabaseError('Error while accepting follow.', err);
    }
  };

  /**
   * Checks if a follow document exists with the provided follower and followee ids.
   * @param {string} followerId
   * @param {string} followeeId
   * @returns {Promise<IFollow>} the follow document if it exists
   */
  public findFollow = async (
    followerId: string,
    followeeId: string
  ): Promise<IFollow | null> => {
    try {
      const follow = await this.followModel
        .findOne({
          follower: followerId,
          followee: followeeId,
        })
        .populate('followee');
      return follow;
    } catch (err) {
      throw new DatabaseError('Error finding follow.', err);
    }
  };
}
