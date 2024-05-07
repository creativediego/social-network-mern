import mongoose from 'mongoose';
import { IUser } from '../../features/user/models/IUser';
import { UserAccountType } from '../../features/user/models/UserAccountType';
import { UserAccountStatus } from '../../features/user/models/UserAccountStatus';

export const mockUsers: IUser[] = [
  {
    id: '1234',
    uid: '5678',
    username: 'neo',
    email: 'keanu@gmail.com',
    name: 'Keanu Reeves',
    bio: 'I am the one',
    headerImage: '',
    profilePhoto: '',
    accountType: UserAccountType.Personal,
    accountStatus: UserAccountStatus.Active,
    followerCount: 0,
    followeeCount: 0,
    registeredWithProvider: false,
  },
  {
    id: '1234',
    uid: '5678',
    username: 'batman',
    email: 'batman@gmail.com',
    name: 'Bruce Wayne',
    bio: 'I am the knight ;)',
    headerImage: '',
    profilePhoto: '',
    accountType: UserAccountType.Personal,
    accountStatus: UserAccountStatus.Active,
    followerCount: 0,
    followeeCount: 0,
    registeredWithProvider: false,
  },
];
