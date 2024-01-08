import mongoose from 'mongoose';
import IUser from '../../models/users/IUser';
import { UserAccountType } from '../../models/users/UserAccoutType';
import { UserAccountStatus } from '../../models/users/UserAccountStatus';
import { formatJSON } from '../util/formatJSON';
import { formatUserJSON } from '../util/formatUserJSON';

/**
 * Mongoose database schema for the user resource, based on an {@link IUser} interface.
 * @constructor
 * @param {String} username the unique username of the user
 * @param {String} firstName first name
 * @param {String} lastName last name
 * @param {String} password password
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
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String },
    bio: { type: String },
    headerImage: { type: String },
    profilePhoto: {
      type: String,
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

formatUserJSON(UserSchema);
formatJSON(UserSchema);
export default UserSchema;
