import { IUser } from './IUser';

export interface IChat {
  id: string;
  type?: string;
  creatorId: string;
  participants: IUser[];
  deletedBy: string[];
  readBy: string[];
}
