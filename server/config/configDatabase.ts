import mongoose, { Connection } from 'mongoose';
import { ConnectionOptions } from 'tls';

/**
 * connectToDatabase function.
 *
 * This asynchronous function establishes a connection to a MongoDB database using the `mongoose` package.
 * It takes a database URI and an optional `ConnectionOptions` object as parameters.
 *
 * If the connection is successful, it logs a success message and returns the database connection object.
 * If there is an error in establishing the connection, it logs the error and rethrows it for handling at the calling end.
 *
 * @param {string} dbURI - The URI of the MongoDB database to connect to.
 * @param {ConnectionOptions} [options] - The optional connection options.
 * @returns {Promise<Connection>} The database connection object.
 * @throws {Error} If there is an error in establishing the connection.
 */
export async function connectToDatabase(
  dbURI: string,
  options?: ConnectionOptions
): Promise<Connection> {
  console.log(dbURI);
  try {
    // Establishing connection to MongoDB
    await mongoose.connect(dbURI);

    // Connection successful, returning the database object
    const db: Connection = mongoose.connection;

    console.log('Connected to the following database successfully:', db.name);

    return db;
  } catch (error) {
    // Handle connection errors here
    console.error('Error connecting to database:', error);
    throw error; // Rethrow the error for handling at the calling end
  }
}
