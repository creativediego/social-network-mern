import mongoose, { Connection } from 'mongoose';
import { ConnectionOptions } from 'tls';
import { InMemoryMongoServer } from '../tests/mocks/configInMemoryMongo';
import { seedDb } from '../seedData';
import { ILogger } from '../common/logger/ILogger';

/**
 * Configures the database connection based on the environment. If in development, it will use an in-memory MongoDB server. If in production, it will use the provided MongoDB URI. Also seeds the database with mock data both in development and production.
 * @param prodURI the production MongoDB URI
 * @param logger the logger instance
 * @param options the connection options
 * @returns the database connection
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
      await seedDb(mongoose.connection); // Seed the database with mock data.
      logger.info('Development db connected and seeded.');
      return mongoose.connection;
    } else if (prodURI) {
      await mongoose.connect(prodURI);
      logger.info(
        `Connected to production db: ${mongoose.connection.db.databaseName}`
      );
      await seedDb(mongoose.connection); // Seed the database with mock data.
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
