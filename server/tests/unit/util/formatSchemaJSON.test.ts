import mongoose from 'mongoose';
import { formatSchemaJSON } from '../../../common/util/formatSchemaJSON';
import PostSchema from '../../../features/post/models/PostSchema';
import { IPost } from '../../../features/post/models/IPost';
import { InMemoryMongoServer } from '../../mocks/configInMemoryMongo';

describe('formatSchemaJSON utility for PostSchema', () => {
  let PostModel: mongoose.Model<IPost, {}, {}, {}, any>;
  let mongoServer: InMemoryMongoServer;

  beforeAll(async () => {
    // Connect to a testing database
    mongoServer.connect();

    // Apply the utility function to the PostSchema
    formatSchemaJSON(PostSchema);

    // Create the Mongoose model using the schema
    PostModel = mongoose.model('Post', PostSchema);
  });

  afterAll(async () => {
    // Disconnect from the testing database after all tests are done
    await mongoServer.clearDatabase();
    await mongoServer.disconnect();
  });

  it('should format the document toJSON output correctly', async () => {
    // Create a test document
    const testDocument = new PostModel({
      author: new mongoose.Types.ObjectId(), // Replace with a valid ObjectId
      post: 'This is a test post',
      stats: {
        likes: 10,
        replies: 5,
        dislikes: 2,
        reposts: 3,
      },
      image: 'https://example.com/test-image.jpg',
      likedBy: [],
      dislikedBy: [],
    });

    // Save the document to the database
    await testDocument.save();

    // Retrieve the document from the database
    const savedDocument = await PostModel.findOne({
      post: 'This is a test post',
    });

    // Check if the toJSON method has correctly formatted the document
    expect(savedDocument?.toJSON()).toEqual({
      id: savedDocument?._id.toString(),
      author: savedDocument?.author.toString(),
      post: 'This is a test post',
      stats: {
        likes: 10,
        replies: 5,
        dislikes: 2,
        reposts: 3,
      },
      image: 'https://example.com/test-image.jpg',
      likedBy: [],
      dislikedBy: [],
      createdAt: savedDocument?.createdAt?.toISOString(),
      updatedAt: savedDocument?.updatedAt?.toISOString(),
    });
  });
});
