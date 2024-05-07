import mongoose, { Connection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let dbServer: MongoMemoryServer;

export class InMemoryMongoServer {
  public constructor() {
    Object.freeze(this);
  }

  private start = async (): Promise<void> => {
    dbServer = await MongoMemoryServer.create();
  };

  public getUri = () => {
    const uri = dbServer.getUri();
    return uri;
  };

  private stop = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await dbServer.stop();
  };

  public clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  };

  public connect = async (): Promise<Connection> => {
    await this.start();
    const uri = this.getUri();

    const mongooseOpts = {
      useNewUrlParser: true,
      socketTimeoutMS: 45000,
    };
    await mongoose.connect(uri, mongooseOpts);
    const connection = mongoose.connection;
    return connection;
  };

  public disconnect = async () => {
    await this.stop();
    await mongoose.disconnect();
  };
}

// const init = async (): Promise<void> => {
//   dbServer = await MongoMemoryServer.create();
// };

// const getUri = () => {
//   const uri = dbServer.getUri();
//   return uri;
// };

// // /**
// //  * Connect to mock memory db.
// //  */
// export const connectDb = async () => {
//   await init();
//   const uri = dbServer.getUri();

//   const mongooseOpts = {
//     useNewUrlParser: true,
//     socketTimeoutMS: 45000,
//   };
//   await mongoose.connect(uri, mongooseOpts);
// };
// /**
//  * Reconnect to the existing in memory db
//  */
// const reconnect = async () => {
//   const uri = getUri();
//   await mongoose.connect(uri);
// };

// // /**
// //  * Close db connection
// //  */
// export const closeDatabase = async () => {
//   await reconnect();
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
//   await dbServer.stop();
// };

// /**
//  * Delete db collections
//  */
// export const clearDatabase = async () => {
//   await reconnect();
//   const collections = mongoose.connection.collections;

//   for (const key in collections) {
//     const collection = collections[key];
//     await collection.deleteMany({});
//   }
// };
