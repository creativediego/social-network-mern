import dotenv from 'dotenv';
import connectToDatabase from './config/configDatabase';
import UserModel from './mongoose/users/UserModel';
import PostModel from './mongoose/posts/PostModel';
import mongoose, { Connection } from 'mongoose';
import { UserAccountType } from './models/users/UserAccoutType';
import { ChatType } from './models/messages/ChatType';
import ChatModel from './mongoose/messages/ChatModel';
import MessageModel from './mongoose/messages/MessageModel';

dotenv.config({ path: './.env' });

function getRandomNumberBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

const getRandomImageURLs = (gender: string, quantity: number) => {
  let imageURLs = [];
  let usedNumbers: number[] = [];
  while (imageURLs.length < quantity) {
    const randomNumber = Math.floor(Math.random() * quantity) + 1;
    if (!usedNumbers.includes(randomNumber)) {
      usedNumbers.push(randomNumber);
      const imageURL = `https://randomuser.me/api/portraits/${gender}/${randomNumber}.jpg`;
      imageURLs.push(imageURL);
    }
  }
  return imageURLs;
};

function newRandomDateWithinThisYear() {
  const start = new Date(new Date().getFullYear(), 0, 1);
  const end = new Date(); // Current date and time

  // Adjust end date to prevent generating dates beyond current time
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  end.setFullYear(currentYear, currentMonth, currentDate);

  const randomTime =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const randomDate = new Date(randomTime);

  return randomDate;
}

const randomMenProfilePhotos = getRandomImageURLs('men', 100);
const randomWomenProfilePhotos = getRandomImageURLs('women', 100);

const profiles = [
  {
    uid: 'CwGYeQ5rVtU9SPa1LTTbaI34J3R2',
    email: 'creativehtml5@gmail.com',
    bio: 'life is a dream!',
    birthday: '1980-01-01',
    name: 'Creative Dev',
    profilePhoto: randomMenProfilePhotos[2],
    username: 'creatived',
    headerImage:
      'https://firebasestorage.googleapis.com/v0/b/tuiter-2e307.appspot.com/o/users%2FXxgohUN2Uudo83BEZwgrXA1J76E3%2Fprofile%2FXxgohUN2Uudo83BEZwgrXA1J76E3-header?alt=media&token=b5448fae-b14e-4857-b9ad-10a50c0e824a',
  },
  {
    uid: '2',
    username: 'johnsmith',
    password: 'abc123',
    name: 'John Smith',
    email: 'john.smith@gmail.com',
    bio: 'I am a software developer who loves to work with new technologies and solve challenging problems. In my free time, I enjoy reading, hiking, and playing video games.',
    birthday: '1980-01-01',
    profilePhoto: randomMenProfilePhotos[0],
  },

  {
    uid: '3',
    username: 'sarahjohnson',
    password: 'def456',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@gmail.com',
    bio: 'I am a graphic designer who is passionate about creating visually stunning designs that tell a story. In my free time, I enjoy painting, photography, and traveling.',
    birthday: '1985-02-14',
    profilePhoto: randomWomenProfilePhotos[0],
  },
  {
    uid: '4',
    username: 'michaeljames',
    password: 'ghi789',
    name: 'Michael James',
    email: 'michael.brown@gmail.com',
    bio: 'I am a marketer who specializes in creating and executing effective marketing campaigns. In my free time, I enjoy running, watching movies, and playing the guitar.',
    birthday: '1990-03-21',
    profilePhoto: randomMenProfilePhotos[1],
  },
  {
    uid: '5',
    username: 'katiejohnson',
    password: 'jkl101',
    name: 'Katie Johnson',
    email: 'katie.johnson@gmail.com',
    bio: 'I am a content writer who enjoys crafting engaging and informative articles. In my free time, I enjoy reading, writing fiction, and spending time with my family.',
    birthday: '1995-04-28',
    profilePhoto: randomWomenProfilePhotos[1],
  },
  {
    uid: '6',
    username: 'jenniferbrown',
    password: 'mno112',
    name: 'Jennifer Brown',
    email: 'jennifer.brown@gmail.com',
    bio: 'I am a social media manager who helps businesses build their online presence and connect with their customers. In my free time, I enjoy dancing, cooking, and watching reality TV shows.',
    birthday: '2000-05-05',
    profilePhoto: randomWomenProfilePhotos[2],
  },
];

const createSeedUser = () => {
  return {
    _id: new mongoose.Types.ObjectId(),
    accountType: UserAccountType.Personal,
    followerCount: getRandomNumberBetween(0, 100),
    followeeCount: getRandomNumberBetween(0, 100),
    postCount: getRandomNumberBetween(0, 100),
    createdAt: newRandomDateWithinThisYear(),
    updatedAt: newRandomDateWithinThisYear(),
  };
};

const userSeeds: any[] = [];

for (let i = 0; i < profiles.length; i++) {
  let user = createSeedUser();
  user = {
    ...user,
    ...profiles[i],
  };

  userSeeds.push(user);
}

const posts = [
  "Just got my hands on the new iPhone and it's a game changer! #technology",
  'Nature is so beautiful today. Going for a hike in the mountains. #nature',
  'Just saw the new Marvel movie and it did not disappoint. #movies',
  "Reading 'The Alchemist' for the second time and it's just as inspiring as the first. #books",
  "Trying out the new vegan restaurant in town and it's surprisingly delicious. #food",
  'Watching the sunset at the beach is one of my favorite things to do. #nature',
  'The new Netflix documentary on climate change is a must-watch. #environment',
  "Finished 'Educated' by Tara Westover and it was a powerful read. #books",
  "Trying out the new meditation app and it's already making a difference in my stress levels. #wellness",
  'The new Star Wars movie was everything I hoped it would be and more. #movies',
  'Nothing beats a good old-fashioned hike in the woods. #nature',
  "Just discovered a new indie band and I'm hooked. #music",
  "Started using a standing desk and it's already improving my posture. #health",
  "Reading 'The Alchemist' for the second time and it's just as inspiring as the first. #books",
  'The new art exhibit at the museum was breathtaking. #art',
  "Just finished 'The Four Winds' by Kristin Hannah and it was a beautiful read. #books",
  "Watching the new season of The Mandalorian and it's already shaping up to be even better than the first. #tv",
  'The new plant-based burger at the restaurant I tried was delicious. #food',
  'I love the feeling of accomplishment after a good workout. #fitness',
];

const createSeedPost = (postNumber: number, authorNumber: number): any => {
  return {
    post: posts[postNumber],
    author: userSeeds[authorNumber],
    stats: {
      likes: getRandomNumberBetween(1, 1000),
      dislikes: getRandomNumberBetween(1, 1000),
      replies: getRandomNumberBetween(1, 1000),
      reposts: getRandomNumberBetween(1, 1000),
    },
    postedDate: newRandomDateWithinThisYear(),
    // hashtags: ['artificialintelligence', 'machinelearning'],
    createdAt: newRandomDateWithinThisYear(),
    updatedAt: newRandomDateWithinThisYear(),
  };
};

/**
 * Generates seed data for users and posts. The number of users and posts generated can be configured by changing the values of the `numberOfUsers` and `numberOfPosts` variables.
 */
let postSeeds: any[] = [];
for (let i = 0; i < posts.length; i++) {
  // Select a random author for the post
  const authorIndex = getRandomNumberBetween(0, profiles.length - 1);
  const post = createSeedPost(i, authorIndex);
  postSeeds.push(post);
}

// Call the function to create seed conversations and messages
// Generating seed data for conversations
const chatSeeds = [
  {
    _id: new mongoose.Types.ObjectId(),
    type: 'PRIVATE', // Replace with ConversationType or the appropriate type
    creatorId: userSeeds[0]._id, // Selecting a user as the conversation creator
    participants: [userSeeds[0]._id, userSeeds[2]._id], // Participants in the conversation
    deletedBy: [], // Initializing optional fields as empty arrays
    readBy: [], // Initializing optional fields as empty arrays
  },
  {
    _id: new mongoose.Types.ObjectId(),
    type: 'GROUP', // Replace with ConversationType or the appropriate type
    creatorId: userSeeds[1]._id,
    participants: [userSeeds[0]._id, userSeeds[1]._id, userSeeds[2]._id], // Participants in the conversation
    deletedBy: [], // Initializing optional fields as empty arrays
    readBy: [], // Initializing optional fields as empty arrays
  },
];

// Generating seed data for messages related to chats
const messageSeeds = [
  {
    _id: new mongoose.Types.ObjectId(),
    sender: userSeeds[0]._id, // Sender of the message
    recipients: [userSeeds[0]._id, userSeeds[2]._id], // Recipient(s) of the message
    chatId: chatSeeds[0]._id, // Corresponding chat ID
    chat: chatSeeds[0], // Reference to the chat object
    content: 'Hi Sarah, how are you?', // Message content
    createdAt: newRandomDateWithinThisYear(), // Date and time of message creation
    removeFor: [], // Initializing optional fields as empty arrays
    readFor: [], // Initializing optional fields as empty arrays
  },
  {
    _id: new mongoose.Types.ObjectId(),
    sender: userSeeds[0]._id, // Sender of the message
    recipients: [userSeeds[0]._id, userSeeds[2]._id], // Recipient(s) of the message
    chatId: chatSeeds[0]._id, // Corresponding chat ID
    chat: chatSeeds[0], // Reference to the chat object
    content: 'Happy new year Sarah!', // Message content
    createdAt: newRandomDateWithinThisYear(), // Date and time of message creation
    removeFor: [], // Initializing optional fields as empty arrays
    readFor: [], // Initializing optional fields as empty arrays
  },

  {
    _id: new mongoose.Types.ObjectId(),
    sender: userSeeds[2]._id, // Sender of the message
    recipients: [userSeeds[0]._id, userSeeds[2]._id], // Recipient(s) of the message
    chatId: chatSeeds[0]._id, // Corresponding chat ID
    chat: chatSeeds[0], // Reference to the chat object
    content: 'Hello my friend!', // Message content
    createdAt: newRandomDateWithinThisYear(), // Date and time of message creation
    removeFor: [], // Initializing optional fields as empty arrays
    readFor: [], // Initializing optional fields as empty arrays
  },
  {
    _id: new mongoose.Types.ObjectId(),
    sender: userSeeds[1]._id, // Sender of the message
    recipients: [userSeeds[0]._id, userSeeds[1]._id, userSeeds[2]._id], // Recipient(s) of the message
    chatId: chatSeeds[1]._id, // Corresponding chat ID
    chat: chatSeeds[1], // Reference to the chat object
    content: 'This group is awesome!', // Message content
    createdAt: newRandomDateWithinThisYear(), // Date and time of message creation
    removeFor: [], // Initializing optional fields as empty arrays
    readFor: [], // Initializing optional fields as empty arrays
  },
  {
    _id: new mongoose.Types.ObjectId(),
    sender: userSeeds[2]._id, // Sender of the message
    recipients: [userSeeds[0]._id, userSeeds[1]._id, userSeeds[2]._id], // Recipient(s) of the message
    chatId: chatSeeds[1]._id, // Corresponding chat ID
    chat: chatSeeds[1], // Reference to the chat object
    content: 'I totally agree this group is awesome!', // Message content
    createdAt: newRandomDateWithinThisYear(), // Date and time of message creation
    removeFor: [], // Initializing optional fields as empty arrays
    readFor: [], // Initializing optional fields as empty arrays
  },
  {
    _id: new mongoose.Types.ObjectId(),
    sender: userSeeds[0]._id, // Sender of the message
    recipients: [userSeeds[0]._id, userSeeds[1]._id, userSeeds[2]._id], // Recipient(s) of the message
    chatId: chatSeeds[1]._id, // Corresponding chat ID
    chat: chatSeeds[1], // Reference to the chat object
    content: 'Oh, well hello group!', // Message content
    createdAt: newRandomDateWithinThisYear(), // Date and time of message creation
    removeFor: [], // Initializing optional fields as empty arrays
    readFor: [], // Initializing optional fields as empty arrays
  },
];

// Function to create seed chats and messages
const createSeedChatsAndMessages = async () => {
  // Connect to the MongoDB database
  // Insert seed chats into the chats collection
  const insertedChats = await ChatModel.insertMany(chatSeeds);

  // Update message seeds with inserted chat IDs
  // messageSeeds.forEach((messageSeed, index) => {
  //   messageSeed.chat = insertedChats[index % insertedChats.length]._id;
  // });

  // Insert seed messages into the messages collection
  await MessageModel.insertMany(messageSeeds);

  console.log('Seeded chats and messages!');
};

// Conect to mongoDB and then drop all collections, and then seed the users and posts collections
let db: Connection;
(async () => {
  console.log('=================');
  console.log('Connecting to Database...');
  console.log('=================');
  db = await connectToDatabase(process.env.API_MONGO_URI!);
  console.log('Dropping database...');
  await db.dropDatabase();
  console.log('Seeding database...');
  await UserModel.insertMany(userSeeds);
  await PostModel.insertMany(postSeeds);
  await createSeedChatsAndMessages();
  console.log('=================');
  console.log('Seeded database!');
  console.log('=================');
  process.exit(0);
})();
