import mongoose, { Connection } from 'mongoose';
import { ConnectionOptions } from 'tls';

async function connectToDatabase(
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

export default connectToDatabase;
