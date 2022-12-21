/**
 * @readonly
 * @enum {string}
 * Error messages for the post DAO used when throwing exceptions.
 */
export enum PostDaoErrors {
  NO_USER_FOUND = 'Cannot create post: A user by this id was not found.',
  DB_ERROR_CREATING_TUIT = 'Database error creating post.',
  DB_ERROR_EXISTS = 'Database error checking if post exists.',
  TUIT_NOT_FOUND = 'No matching post(s) found',
  DB_ERROR_FINDING_TUITS = 'DB error finding post(s)',
  DB_ERROR_UPDATING_TUIT = 'DB error updating post.',
  DB_ERROR_DELETING_TUIT = 'DB error deleting post.',
}
