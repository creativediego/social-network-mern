import dotenv from 'dotenv';
import { configDatabase } from './config/configDatabase';
import UserModel from './features/user/models/UserModel';
import PostModel from './features/post/models/PostModel';
import mongoose, { Connection } from 'mongoose';
import { UserAccountType } from './features/user/models/UserAccountType';
import ChatModel from './features/chat/models/chat/ChatModel';
import MessageModel from './features/chat/models/message/ChatMessageModel';

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

const profiles = [
  {
    uid: 'CwGYeQ5rVtU9SPa1LTTbaI34J3R2',
    email: 'exampleemail@example.com',
    bio: 'life is a dream!',
    birthday: '1980-01-01',
    name: 'Creative Dev',
    profilePhoto: `https://randomuser.me/api/portraits/men/40.jpg`,
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
    profilePhoto: `https://randomuser.me/api/portraits/men/1.jpg`,
  },
  {
    uid: '3',
    username: 'sarahjohnson',
    password: 'def456',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@gmail.com',
    bio: 'I am a graphic designer who is passionate about creating visually stunning designs that tell a story. In my free time, I enjoy painting, photography, and traveling.',
    birthday: '1985-02-14',
    profilePhoto: `https://randomuser.me/api/portraits/women/1.jpg`,
  },
  {
    uid: '4',
    username: 'michaeljames',
    password: 'ghi789',
    name: 'Michael James',
    email: 'michael.brown@gmail.com',
    bio: 'I am a marketer who specializes in creating and executing effective marketing campaigns. In my free time, I enjoy running, watching movies, and playing the guitar.',
    birthday: '1990-03-21',
    profilePhoto: `https://randomuser.me/api/portraits/men/2.jpg`,
  },
  {
    uid: '5',
    username: 'katiejohnson',
    password: 'jkl101',
    name: 'Katie Johnson',
    email: 'katie.johnson@gmail.com',
    bio: 'I am a content writer who enjoys crafting engaging and informative articles. In my free time, I enjoy reading, writing fiction, and spending time with my family.',
    birthday: '1995-04-28',
    profilePhoto: `https://randomuser.me/api/portraits/women/2.jpg`,
  },
  {
    uid: '6',
    username: 'jenniferbrown',
    password: 'mno112',
    name: 'Jennifer Brown',
    email: 'jennifer.brown@gmail.com',
    bio: 'I am a social media manager who helps businesses build their online presence and connect with their customers. In my free time, I enjoy dancing, cooking, and watching reality TV shows.',
    birthday: '2000-05-05',
    profilePhoto: `https://randomuser.me/api/portraits/women/3.jpg`,
  },
  {
    uid: '7',
    username: 'williamwilson',
    password: 'pqr123',
    name: 'William Wilson',
    email: 'william.wilson@gmail.com',
    bio: 'I am a biologist who is passionate about conservation and wildlife research. In my free time, I enjoy birdwatching, hiking, and photography.',
    birthday: '1981-06-15',
    profilePhoto: `https://randomuser.me/api/portraits/men/3.jpg`,
  },
  {
    uid: '8',
    username: 'emilybrown',
    password: 'stu456',
    name: 'Emily Brown',
    email: 'emily.brown@gmail.com',
    bio: 'I am a teacher who believes in the power of education to change lives. In my free time, I enjoy reading, painting, and mentoring students.',
    birthday: '1986-07-28',
    profilePhoto: `https://randomuser.me/api/portraits/women/4.jpg`,
  },
  {
    uid: '9',
    username: 'davidjones',
    password: 'vwx789',
    name: 'David Jones',
    email: 'david.jones@gmail.com',
    bio: 'I am a software developer with a passion for creating innovative apps. In my free time, I enjoy coding, gaming, and hiking in the great outdoors.',
    birthday: '1991-08-04',
    profilePhoto: `https://randomuser.me/api/portraits/men/4.jpg`,
  },
  {
    uid: '10',
    username: 'oliviasmith',
    password: 'yza101',
    name: 'Olivia Smith',
    email: 'olivia.smith@gmail.com',
    bio: 'I am a writer who finds inspiration in everyday life. In my free time, I enjoy writing poetry, hiking, and exploring new places.',
    birthday: '1982-09-11',
    profilePhoto: `https://randomuser.me/api/portraits/women/5.jpg`,
  },
  {
    uid: '11',
    username: 'josephwilson',
    password: 'bcd234',
    name: 'Joseph Wilson',
    email: 'joseph.wilson@gmail.com',
    bio: 'I am a lawyer who is passionate about justice and human rights. In my free time, I enjoy reading legal thrillers, volunteering, and playing chess.',
    birthday: '1987-10-17',
    profilePhoto: `https://randomuser.me/api/portraits/men/5.jpg`,
  },
  {
    uid: '12',
    username: 'gracejones',
    password: 'efg567',
    name: 'Grace Jones',
    email: 'grace.jones@gmail.com',
    bio: 'I am a nurse who cares deeply for others. In my free time, I enjoy gardening, volunteering at local clinics, and traveling to provide medical aid.',
    birthday: '1992-11-22',
    profilePhoto: `https://randomuser.me/api/portraits/women/6.jpg`,
  },
  {
    uid: '13',
    username: 'matthewdavis',
    password: 'hij890',
    name: 'Matthew Davis',
    email: 'matthew.davis@gmail.com',
    bio: 'I am a physicist who explores the mysteries of the universe. In my free time, I enjoy stargazing, reading science fiction, and conducting experiments.',
    birthday: '1997-12-30',
    profilePhoto: `https://randomuser.me/api/portraits/men/6.jpg`,
  },
  {
    uid: '14',
    username: 'zoewilson',
    password: 'klm111',
    name: 'Zoe Wilson',
    email: 'zoe.wilson@gmail.com',
    bio: 'I am an artist who expresses emotions through abstract paintings. In my free time, I enjoy visiting art galleries, meditating, and creating art in my studio.',
    birthday: '1983-01-15',
    profilePhoto: `https://randomuser.me/api/portraits/women/7.jpg`,
  },
  {
    uid: '15',
    username: 'sophiabrown',
    password: 'nop222',
    name: 'Sophia Brown',
    email: 'sophia.brown@gmail.com',
    bio: 'I am a psychologist who believes in the power of the mind. In my free time, I enjoy studying human behavior, practicing mindfulness, and helping others find inner peace.',
    birthday: '1988-02-21',
    profilePhoto: `https://randomuser.me/api/portraits/women/8.jpg`,
  },
  {
    uid: '16',
    username: 'lucaswilson',
    password: 'qrs333',
    name: 'Lucas Wilson',
    email: 'lucas.wilson@gmail.com',
    bio: 'I am a journalist who seeks truth and tells stories that matter. In my free time, I enjoy writing, exploring the city, and interviewing fascinating people.',
    birthday: '1993-03-28',
    profilePhoto: `https://randomuser.me/api/portraits/men/7.jpg`,
  },
  {
    uid: '17',
    username: 'elliejohnson',
    password: 'tuv444',
    name: 'Ellie Johnson',
    email: 'ellie.johnson@gmail.com',
    bio: 'I am an environmentalist who fights for a sustainable future. In my free time, I enjoy hiking in national parks, organizing eco-friendly events, and advocating for change.',
    birthday: '1984-04-05',
    profilePhoto: `https://randomuser.me/api/portraits/women/9.jpg`,
  },
  {
    uid: '18',
    username: 'noahwilson',
    password: 'wxy555',
    name: 'Noah Wilson',
    email: 'noah.wilson@gmail.com',
    bio: 'I am a geologist who uncovers the secrets of the Earth. In my free time, I enjoy rock climbing, collecting minerals, and exploring caves.',
    birthday: '1989-05-12',
    profilePhoto: `https://randomuser.me/api/portraits/men/8.jpg`,
  },
  {
    uid: '19',
    username: 'miajones',
    password: 'zab666',
    name: 'Mia Jones',
    email: 'mia.jones@gmail.com',
    bio: 'I am a fashion designer who creates wearable art. In my free time, I enjoy sketching fashion ideas, sewing, and attending fashion shows.',
    birthday: '1994-06-19',
    profilePhoto: `https://randomuser.me/api/portraits/women/10.jpg`,
  },
  {
    uid: '20',
    username: 'ethanjones',
    password: 'cde777',
    name: 'Ethan Jones',
    email: 'ethan.jones@gmail.com',
    bio: 'I am a software engineer who enjoys solving complex problems with elegant code. In my free time, I enjoy coding personal projects, gaming, and building robots.',
    birthday: '1990-07-26',
    profilePhoto: `https://randomuser.me/api/portraits/men/10.jpg`,
  },
  {
    uid: 'wCqeUx0rj1SdtCedNL6aRNlDTev1',
    email: 'exampleemail2@example.com',
    bio: 'life is a dream!',
    birthday: '1980-01-01',
    name: 'Boston Life',
    profilePhoto: `https://randomuser.me/api/portraits/men/40.jpg`,
    username: 'bostonlife',
    headerImage:
      'https://firebasestorage.googleapis.com/v0/b/tuiter-2e307.appspot.com/o/users%2FXxgohUN2Uudo83BEZwgrXA1J76E3%2Fprofile%2FXxgohUN2Uudo83BEZwgrXA1J76E3-header?alt=media&token=b5448fae-b14e-4857-b9ad-10a50c0e824a',
  },
  // Add more users with profilePhoto field here...

  // You can add more users to this array as needed.

  // You can add more users to this array as needed.
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
  "Visited the local farmers' market today and got some amazing fresh produce. #food",
  "Spent the day exploring a new city, and I'm in love with its charm. #travel",
  'Movie night with friends is always a blast! #movies #friends',
  "Just started learning a new language, and it's both challenging and exciting. #languagelearning",
  'A rainy day is perfect for cozying up with a good book and some hot tea. #books #rainyday',
  'Tried my hand at cooking a gourmet meal tonight, and it turned out surprisingly well. #cooking',
  'Visited an art gallery and was inspired by the creativity on display. #art',
  'Listening to my favorite podcast while going for a long walk - the best way to unwind. #podcasts #wellness',
  'The view from my window right now is absolutely stunning. #nature',
  'Attended a live concert last night, and the energy in the crowd was electric! #music',
  'Just finished a DIY home improvement project, and I am so proud of the result. #DIY',
  'Exploring the world of virtual reality gaming and it feels like a whole new dimension. #gaming',
  'Booked tickets for a spontaneous weekend getaway. Adventure awaits! #travel',
  "Trying out a new recipe for a vegan dessert, and it's a sweet success! #cooking #vegan",
  'Reconnecting with old friends over a cup of coffee - the best kind of therapy. #friends #coffee',
  'The colors of the autumn leaves are absolutely breathtaking. #nature #fall',
  "Started a journaling practice, and it's helping me reflect on my thoughts and feelings. #journaling",
  'Just adopted a rescue dog, and my heart is full of love for this furry friend. #pets #love',
  'Spent the evening stargazing and marveling at the vastness of the universe. #space #nature',
  'Attended a mindfulness retreat, and it was a transformative experience. #mindfulness #wellness',
  "Cooked a homemade pizza from scratch, and it's better than any takeout. #cooking",
  'Hiking in the snow-covered mountains is an entirely different and beautiful experience. #nature #winter',
  'Rediscovered my passion for painting, and it feels like a therapeutic escape. #art #creativity',
  'Just started a new book club with friends, and our first pick is already captivating. #books #bookclub',
  'Spent the weekend volunteering at a local shelter, and it warmed my heart. #volunteering #community',
  "Binge-watched a gripping new series on Netflix, and now I'm craving more. #tv",
  'Found a hidden gem of a cafe with the coziest atmosphere and the best coffee. #coffee #cafe',
  "Exploring a hidden waterfall in the jungle today. Nature's beauty never ceases to amaze me. #adventure",
  'Just attended a cooking class and learned how to make delicious sushi. Feeling like a culinary pro now! #cooking',
  'Visited a historical castle and was transported back in time. #history',
  'Started a new fitness challenge today, and the sweat is worth it. #fitnessgoals',
  'Spent the day volunteering at a local animal shelter. These furry friends stole my heart. #volunteering',
  'Enjoying a quiet evening with a cup of tea and a good book. #readingtime',
  'Witnessed a stunning meteor shower tonight. The universe is full of wonders. #stargazing',
  "Just finished a 5K run, and it's such a satisfying feeling. #running",
  'Explored a picturesque fishing village and indulged in fresh seafood. #travel',
  'Took a spontaneous road trip with friends, and the open road is full of surprises. #roadtrip',
  'Tried out a new art technique and created a masterpiece. #artistic',
  "Celebrated a friend's birthday with a surprise party. The joy on their face was priceless. #friends",
  'Attended a live jazz concert and was mesmerized by the music. #musiclover',
  'Spent the day at an amusement park, and the roller coasters were a thrilling adventure. #fun',
  'Cooked a gourmet dinner for a special someone. It was a night to remember. #romantic',
  'Went on a photography expedition and captured the beauty of nature from unique angles. #photography',
  'Visited a serene Buddhist temple and found inner peace. #spirituality',
  'Starting a new chapter in life today. Exciting times ahead! #newbeginnings',
  'Attended a yoga retreat and rediscovered my mind-body connection. #yogalife',
  'Spent the weekend at a cozy cabin in the woods, surrounded by nature. #getaway',
  'Had a picnic in the park with friends, and laughter filled the air. #picnic',
  'Adopted a rescue cat and my heart is overflowing with love. #petlover',
  'Tasted exotic street food in a bustling market. The flavors were out of this world. #foodie',
  'Went on a solo hike and found solace in the quiet of the mountains. #solitude',
  'Rekindled my love for painting after years, and it feels like coming home. #creativity',
  'Attended a comedy show and laughed until my sides hurt. #laughtertherapy',
  'Spent the day at an art gallery, and each painting told a different story. #artappreciation',
  'Took a helicopter ride over the city skyline, and the view was breathtaking. #cityscape',
  'Danced the night away at a salsa club. Music and rhythm filled the air. #dancing',
  'Traveled to a remote island and enjoyed the peace and tranquility of the ocean. #islandlife',
  "Cooked a traditional family recipe and shared it with loved ones. It's more than just food; it's a memory. #familytime",
  'Completed a challenging puzzle that tested my patience and perseverance. #puzzlelover',
  'Spent the afternoon at a botanical garden, surrounded by vibrant flowers and lush greenery. #botanicals',
  'Attended a film festival and discovered hidden cinematic gems. #filmlover',
  'Took a hot air balloon ride and saw the world from a different perspective. #adventure',
  'Savored a gourmet tasting menu at a Michelin-starred restaurant. #culinarydelights',
  'Revisited a childhood hobby and found joy in building model airplanes. #nostalgia',
  'Went on a horseback riding adventure through the countryside. Nature and horses – a perfect combination. #equestrian',
  'Spent the day at a science museum, and my curiosity was sparked by the wonders of the universe. #science',
  'Went on a wine tasting tour and explored the flavors of different vineyards. #winetasting',
  'Completed a marathon and proved that determination can achieve anything. #marathonrunner',
  'Traveled to a remote village and immersed myself in the local culture. #culturalexperience',
  'Took a cooking class to master the art of making perfect pastries. #baking',
  'Attended a photography workshop and learned valuable techniques to capture memorable moments. #photographyworkshop',
  'Spent the day at a vintage flea market, finding unique treasures with history. #vintagefinds',
  'Embarked on a spontaneous camping trip and fell asleep under a sky full of stars. #camping',
  'Took a pottery class and shaped clay into beautiful works of art. #pottery',
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
  // {
  //   _id: new mongoose.Types.ObjectId(),
  //   sender: userSeeds[0]._id, // Sender of the message
  //   recipients: [userSeeds[0]._id, userSeeds[2]._id], // Recipient(s) of the message
  //   chatId: chatSeeds[0]._id, // Corresponding chat ID
  //   chat: chatSeeds[0], // Reference to the chat object
  //   content: 'Hi Sarah, how are you?', // Message content
  //   createdAt: newRandomDateWithinThisYear(), // Date and time of message creation
  //   deletedBy: [], // Initializing optional fields as empty arrays
  //   readBy: [userSeeds[0]._id], // Initializing optional fields as empty arrays
  // },
  // {
  //   _id: new mongoose.Types.ObjectId(),
  //   sender: userSeeds[0]._id, // Sender of the message
  //   recipients: [userSeeds[0]._id, userSeeds[2]._id], // Recipient(s) of the message
  //   chatId: chatSeeds[0]._id, // Corresponding chat ID
  //   chat: chatSeeds[0], // Reference to the chat object
  //   content: 'Happy new year Sarah!', // Message content
  //   createdAt: newRandomDateWithinThisYear(), // Date and time of message creation
  //   deletedBy: [], // Initializing optional fields as empty arrays
  //   readBy: [userSeeds[0]._id], // Initializing optional fields as empty arrays
  // },

  {
    _id: new mongoose.Types.ObjectId(),
    sender: userSeeds[2]._id, // Sender of the message
    recipients: [userSeeds[0]._id, userSeeds[2]._id], // Recipient(s) of the message
    chatId: chatSeeds[0]._id, // Corresponding chat ID
    chat: chatSeeds[0], // Reference to the chat object
    content: 'Hello my friend!', // Message content
    createdAt: newRandomDateWithinThisYear(), // Date and time of message creation
    deletedBy: [], // Initializing optional fields as empty arrays
    readBy: [], // Initializing optional fields as empty arrays
  },
  {
    _id: new mongoose.Types.ObjectId(),
    sender: userSeeds[1]._id, // Sender of the message
    recipients: [userSeeds[0]._id, userSeeds[1]._id, userSeeds[2]._id], // Recipient(s) of the message
    chatId: chatSeeds[1]._id, // Corresponding chat ID
    chat: chatSeeds[1], // Reference to the chat object
    content: 'This group is awesome!', // Message content
    createdAt: newRandomDateWithinThisYear(), // Date and time of message creation
    deletedBy: [], // Initializing optional fields as empty arrays
    readBy: [], // Initializing optional fields as empty arrays
  },
  {
    _id: new mongoose.Types.ObjectId(),
    sender: userSeeds[2]._id, // Sender of the message
    recipients: [userSeeds[0]._id, userSeeds[1]._id, userSeeds[2]._id], // Recipient(s) of the message
    chatId: chatSeeds[1]._id, // Corresponding chat ID
    chat: chatSeeds[1], // Reference to the chat object
    content: 'I totally agree this group is awesome!', // Message content
    createdAt: newRandomDateWithinThisYear(), // Date and time of message creation
    deletedBy: [], // Initializing optional fields as empty arrays
    readBy: [], // Initializing optional fields as empty arrays
  },

  // {
  //   _id: new mongoose.Types.ObjectId(),
  //   sender: userSeeds[0]._id, // Sender of the message
  //   recipients: [userSeeds[0]._id, userSeeds[1]._id, userSeeds[2]._id], // Recipient(s) of the message
  //   chatId: chatSeeds[1]._id, // Corresponding chat ID
  //   chat: chatSeeds[1], // Reference to the chat object
  //   content: 'Oh, well hello group!', // Message content
  //   createdAt: newRandomDateWithinThisYear(), // Date and time of message creation
  //   removeFor: [], // Initializing optional fields as empty arrays
  //   readFor: [], // Initializing optional fields as empty arrays
  // },
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

export const seedDb = async (db: Connection): Promise<void> => {
  console.log('=================');
  console.log('Connecting to Database...');
  console.log('=================');
  console.log('Dropping database...');
  await db.dropDatabase();
  console.log('Seeding database...');
  await UserModel.insertMany(userSeeds);
  await PostModel.insertMany(postSeeds);
  await createSeedChatsAndMessages();
  console.log('=================');
  console.log('Seeded database!');
  console.log('=================');
};
