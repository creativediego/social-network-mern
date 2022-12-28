import configDatabase from './config/configDatabase';
import UserModel from './mongoose/users/UserModel';
import PostModel from './mongoose/posts/PostModel';
import mongoose, { ObjectId } from 'mongoose';

configDatabase(process.env.MONGO_URL!);

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

const userData = [
  {
    _id: new mongoose.Types.ObjectId(),
    username: 'ted_mosby',
    password: 'password4',
    name: 'Ted Mosby',
    email: 'ted@example.com',
    bio: 'I am an aspiring actor.',
    birthday: new Date(),
    profilePhoto: randomMenProfilePhotos[0],
    accountType: 'Personal',
    followerCount: 250,
    followeeCount: 100,
    postCount: 40,
    createdAt: newRandomDateWithinThisYear(),
    updatedAt: newRandomDateWithinThisYear(),
  },
];

const postData = [
  {
    post: 'I hope the new year brings amazing things! #amazing',
    author: userData[0]._id,
    stats: {
      likes: 1000,
      dislikes: 50,
      replies: 200,
      reposts: 75,
    },
    postedDate: { $date: '2022-01-01T00:00:00.000Z' },
    hashtags: ['artificialintelligence', 'machinelearning'],
    createdAt: newRandomDateWithinThisYear(),
    updatedAt: newRandomDateWithinThisYear(),
  },
];

UserModel.insertMany(userData);
PostModel.insertMany(postData);
