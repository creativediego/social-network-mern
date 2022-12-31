import { IUser } from './IUser';

export interface IConversation {
  id: string;
  type?: string;
  createdBy: IUser;
  cid?: string;
  participants: IUser[];
  removeFor?: IUser[];
  readFor?: IUser[];
}
