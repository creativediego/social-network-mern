import mongoose from 'mongoose';
import { IUser } from './IUser';
import { UserAccountType } from './UserAccountType';
import { UserAccountStatus } from './UserAccountStatus';
import { formatSchemaJSON } from '../../../common/util/formatSchemaJSON';
import { formatUserJSON } from '../../../common/util/formatUserJSON';

/**
 * Mongoose database schema for the user resource, based on an {@link IUser} interface.
 * @constructor
 * @param {String} username the unique username of the user
 * @param {String} firstName first name
 * @param {String} lastName last name
 * @param {String} email unique email
 * @param {String} profilePhoto photo URL string
 * @param {String} headerImage header image URL string
 * @param {UserAccountType} accountType account type
 * @param {UserAccountStatus} accountStatus account status
 * @param {String} bio biography
 * @param {String} longitude longitude
 * @param {String} latitude latitude
 * @module UserSchema
 */
const UserSchema = new mongoose.Schema<IUser>(
  {
    uid: { type: String, unique: true },
    email: { type: String, required: true, unique: true, match: /^.+@.+\..+$/ },
    username: {
      type: String,
      unique: true,
      match: /^[a-zA-Z0-9_]{3,20}$/,
      required: true,
    },
    name: { type: String, match: /^.{1,40}$/ },
    bio: { type: String, match: /^.{0,200}$/ },
    headerImage: { type: String, match: /^((http|https):\/\/[^ "]+)?$/ },
    profilePhoto: {
      type: String,
      match: /^((http|https):\/\/[^ "]+)?$/,
    },
    // location: { longitude: String, latitude: String, select: false },
    accountType: {
      type: String,
      enum: UserAccountType,
      default: UserAccountType.Personal,
      // required: true,
    },
    accountStatus: {
      type: String,
      enum: UserAccountStatus,
      default: UserAccountStatus.Active,
    },
    followerCount: { type: Number, default: 0 },
    followeeCount: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
    registeredWithProvider: { type: Boolean, default: false },
  },

  { timestamps: true, collection: 'users' }
);

formatSchemaJSON(UserSchema);
export default UserSchema;
