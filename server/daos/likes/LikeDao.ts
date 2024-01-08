import IBaseDao from '../shared/IDao';
import { Model } from 'mongoose';
import ILikeDao from './ILikeDao';
import ILike from '../../models/likes/ILike';
import { DatabaseError } from '../../errors/DatabaseError';

/**
 * Handles database CRUD operations for the likes resource. Implements {@link ILikeDao} and works with the mongoose {@link LikeModel} to access the database.
 */
export class LikeDao implements IBaseDao<ILike> {
  private readonly likeModel: Model<ILike>;

  /**
   * Builds the DAO with the injected dependencies of a mongoose like model ({@link LikeModel}) and an error handler.
   * @param {LikeModel} likeModel the like model for the database operations
   * @param {IErrorHandler} errorHandler the error handler to process all errors
   */
  public constructor(likeModel: Model<ILike>) {
    this.likeModel = likeModel;
    Object.freeze(this); // Make this object immutable.
  }
  findAll = async (criteria?: Partial<ILike>): Promise<ILike[]> =>
    await this.likeModel
      .find(
        {
          post: criteria?.post?.id,
          user: criteria?.user?.id,
        } || {}
      )
      .populate('user')
      .populate('post');

  findOneById = async (id: string): Promise<ILike | null> =>
    await this.likeModel.findById(id);

  findOne = async (criteria: Partial<ILike>): Promise<ILike | null> =>
    await this.likeModel.findOne(criteria);

  create = async (entity: ILike): Promise<ILike> =>
    await this.likeModel.create({
      ...entity,
    });

  update = async (id: string, like: ILike): Promise<ILike> => {
    try {
      const updatedLike = await this.likeModel.findOneAndUpdate(
        { post: like.post.id, user: like.user.id },
        like,
        { new: true }
      );
      if (!updatedLike) {
        throw new Error('Like not found to update.');
      }
      return updatedLike;
    } catch (error) {
      throw new DatabaseError('Error updating like.', error);
    }
  };

  delete = async (id: string): Promise<boolean> => {
    const deletion = await this.likeModel.deleteOne({ _id: id });
    return deletion.acknowledged;
  };
}
