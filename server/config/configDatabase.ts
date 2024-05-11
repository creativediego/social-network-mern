import mongoose, { Connection } from 'mongoose';
import { ConnectionOptions } from 'tls';
import { InMemoryMongoServer } from '../tests/mocks/configInMemoryMongo';
import { seedDb } from '../seedData';
import { ILogger } from '../common/logger/ILogger';

/**
 * Set up development or production MongoDB.
 * If in development, use an in-memory MongoDB server and seed the database. Otherwise, connect to the production MongoDB URI.
 *
 * @param {string} prodURI - The URI of the MongoDB database to connect to.
 * @param {ConnectionOptions} [options] - The optional connection options.
 * @returns {Promise<Connection>} The database connection object.
 * @throws {Error} If there is an error in establishing the connection.
 */
export async function configDatabase(
  prodURI: string,
  logger: ILogger,
  options?: ConnectionOptions
): Promise<Connection> {
  try {
    if (process.env.NODE_ENV === 'development') {
      const mongoServer = new InMemoryMongoServer();
      await mongoServer.connect();
      const devURI = mongoServer.getUri();
      await seedDb(mongoose.connection); // Seed the database with mock data.
      logger.info('Development db connected and seeded.');
      return mongoose.connection;
    } else if (prodURI) {
      await mongoose.connect(prodURI);
      logger.info(
        `Connected to production db: ${mongoose.connection.db.databaseName}`
      );
      return mongoose.connection;
    } else {
      logger.error('No MongoDB URI provided.');
      throw new Error('No MongoDB URI provided');
    }
  } catch (error) {
    logger.error(`Database connection error: ${error}`);
    process.exit(1); // Exit with error code to indicate failure
  }
}
