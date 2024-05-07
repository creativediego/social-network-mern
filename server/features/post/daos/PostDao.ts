import { Model } from 'mongoose';
import { IPost } from '../models/IPost';
import { AbstractMongoDAO } from '../../../common/interfaces/AbstractMongoDAO';
import { DatabaseError } from '../../../common/errors/DatabaseError';
import { IPostDao } from './IPostDao';
import { FilterOptions } from '../../../common/interfaces/IBaseDao';
/**
 * Represents a Data Access Object (DAO) for managing CRUD operations on the 'Post' resource.
 * @implements {IBaseDao<IPost>}
 */
export class PostDao implements IPostDao {
  private readonly model: Model<IPost>;
  /**
   * Creates an instance of the `PostDao` class.
   * @constructor
   * @param {Model<IPost>} postModel - The Mongoose post model used for interacting with the database.
   */
  public constructor(model: Model<IPost>) {
    this.model = model;
    Object.freeze(this);
  }

  create = async (post: IPost): Promise<IPost> => {
    try {
      const newPost = await this.model.create({
        ...post,
        author: post.author.id,
      });
      await newPost.populate('author');
      return newPost;
    } catch (error) {
      throw new DatabaseError('Error while creating post.', error);
    }
  };

  public findAll = async (options?: FilterOptions<IPost>): Promise<IPost[]> => {
    const {
      criteria,
      page = 1,
      limit = 20,
      orderBy = 'createdAt',
      order = 'desc',
    } = options || {};
    try {
      return await this.model
        .find(criteria || {})
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [orderBy]: order === 'asc' ? 1 : -1 })
        .populate('author');
    } catch (error) {
      throw new DatabaseError(`Error while finding all posts.`, error);
    }
  };

  public findAllPostsByKeyword = async (
    keyword: string,
    options?: FilterOptions<IPost>
  ): Promise<IPost[]> => {
    const {
      page = 1,
      limit = 20,
      order = 'desc',
      orderBy = 'createdAt',
    } = options || {};
    try {
      return await this.model
        .find({ post: { $regex: keyword, $options: 'i' } })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [orderBy]: order === 'asc' ? 1 : -1 })
        .populate('author');
    } catch (error) {
      throw new DatabaseError(
        'Error while finding all posts by hashtag.',
        error
      );
    }
  };

  public findAllPostsByAuthorId = async (
    userId: string,
    options?: FilterOptions<IPost>
  ): Promise<IPost[]> => {
    const {
      page = 1,
      limit = 20,
      order = 'desc',
      orderBy = 'createdAt',
    } = options || {};
    try {
      return await this.model
        .find({ author: userId })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [orderBy]: order === 'asc' ? 1 : -1 })
        .populate('author');
    } catch (error) {
      throw new DatabaseError('Error while finding all posts by user.', error);
    }
  };

  public findById = async (id: string): Promise<IPost | null> => {
    try {
      return await this.model.findById(id).populate('author');
    } catch (error) {
      throw new DatabaseError('Error while finding by ID for post', error);
    }
  };

  public update = async (id: string, data: Partial<IPost>): Promise<IPost> => {
    try {
      const result = await this.model
        .findByIdAndUpdate(
          id,
          { ...data, author: data.author?.id },
          {
            new: true,
          }
        )
        .populate('author');
      if (!result) {
        throw new DatabaseError('Post not found to update.');
      }
      return result;
    } catch (error) {
      throw new DatabaseError('Error while updating post', error);
    }
  };

  public deleteManyByAuthorId = async (userId: string): Promise<number> => {
    try {
      const result = await this.model.deleteMany({ author: userId });
      return result.deletedCount;
    } catch (error) {
      throw new DatabaseError('Error while deleting posts by user.', error);
    }
  };

  public delete = async (postId: string): Promise<boolean> => {
    try {
      const result = await this.model.deleteOne({ _id: postId }).exec();
      return result.deletedCount === 1;
    } catch (error) {
      throw new DatabaseError(`Error while deleting post`, error);
    }
  };
}
