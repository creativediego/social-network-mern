import dotenv from 'dotenv';
import configDatabase from './config/configDatabase';
import UserModel from './mongoose/users/UserModel';
import PostModel from './mongoose/posts/PostModel';
import mongoose from 'mongoose';
import { AccountType } from './models/users/AccoutType';
import { exit } from 'process';

dotenv.config();

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
  const end = new Date(new Date().getFullYear(), 11, 31);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const randomMenProfilePhotos = getRandomImageURLs('men', 100);
const randomWomenProfilePhotos = getRandomImageURLs('women', 100);

const profiles = [
  {
    username: 'johnsmith',
    password: 'abc123',
    name: 'John Smith',
    email: 'john.smith@gmail.com',
    bio: 'I am a software developer who loves to work with new technologies and solve challenging problems. In my free time, I enjoy reading, hiking, and playing video games.',
    birthday: '1980-01-01',
    profilePhoto: randomMenProfilePhotos[0],
  },

  {
    username: 'sarahjohnson',
    password: 'def456',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@gmail.com',
    bio: 'I am a graphic designer who is passionate about creating visually stunning designs that tell a story. In my free time, I enjoy painting, photography, and traveling.',
    birthday: '1985-02-14',
    profilePhoto: randomWomenProfilePhotos[0],
  },
  {
    username: 'michaeljames',
    password: 'ghi789',
    name: 'Michael James',
    email: 'michael.brown@gmail.com',
    bio: 'I am a marketer who specializes in creating and executing effective marketing campaigns. In my free time, I enjoy running, watching movies, and playing the guitar.',
    birthday: '1990-03-21',
    profilePhoto: randomMenProfilePhotos[1],
  },
  {
    username: 'katiejohnson',
    password: 'jkl101',
    name: 'Katie Johnson',
    email: 'katie.johnson@gmail.com',
    bio: 'I am a content writer who enjoys crafting engaging and informative articles. In my free time, I enjoy reading, writing fiction, and spending time with my family.',
    birthday: '1995-04-28',
    profilePhoto: randomWomenProfilePhotos[1],
  },
  {
    username: 'jenniferbrown',
    password: 'mno112',
    name: 'Jennifer Brown',
    email: 'jennifer.brown@gmail.com',
    bio: 'I am a social media manager who helps businesses build their online presence and connect with their customers. In my free time, I enjoy dancing, cooking, and watching reality TV shows.',
    birthday: '2000-05-05',
    profilePhoto: randomWomenProfilePhotos[2],
  },
  {
    email: 'createideas@hotmail.com',
    password: 'pass123!',
    bio: 'life is a dream!',
    birthday: '1980-01-01',
    name: 'Creative Dev',
    profilePhoto: randomMenProfilePhotos[2],
    username: 'creatived',
    headerImage:
      'https://firebasestorage.googleapis.com/v0/b/tuiter-2e307.appspot.com/o/users%2FXxgohUN2Uudo83BEZwgrXA1J76E3%2Fprofile%2FXxgohUN2Uudo83BEZwgrXA1J76E3-header?alt=media&token=b5448fae-b14e-4857-b9ad-10a50c0e824a',
  },
  {
    email: 'creativehtml5@gmail.com',
    password: 'pass123!',
    bio: 'I am a fullstack developer who loves developing creative solutions!',
    birthday: '1980-01-01',
    name: 'Fullstack Developer',
    profilePhoto: randomMenProfilePhotos[3],
    username: 'fullstackhouse',
    headerImage:
      'https://firebasestorage.googleapis.com/v0/b/tuiter-2e307.appspot.com/o/users%2FXxgohUN2Uudo83BEZwgrXA1J76E3%2Fprofile%2FXxgohUN2Uudo83BEZwgrXA1J76E3-header?alt=media&token=b5448fae-b14e-4857-b9ad-10a50c0e824a',
  },
];

const createSeedUser = () => {
  return {
    _id: new mongoose.Types.ObjectId(),
    accountType: AccountType.Personal,
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
  user = { ...user, ...profiles[i] };

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
    author: userSeeds[authorNumber]._id,
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

let postSeeds: any[] = [];
for (let i = 0; i < posts.length; i++) {
  const authorIndex = getRandomNumberBetween(0, profiles.length - 1);
  const post = createSeedPost(i, authorIndex);
  postSeeds.push(post);
}

configDatabase(process.env.MONGO_URL!).then(async () => {
  console.log('Dropping user collection.');
  await UserModel.collection.drop();
  console.log('Dropping posts collection.');
  await PostModel.collection.drop();
  console.log('Seeding users.');
  await UserModel.insertMany(userSeeds);
  console.log('Seeding posts.');
  await PostModel.insertMany(postSeeds);
  exit(1);
});

// PostModel.insertMany(postData);
