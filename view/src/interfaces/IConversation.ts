import { IUser } from './IUser';

export interface IConversation {
  type: string;
  createdBy: IUser;
  cid?: string;
  participants: IUser[];
  removeFor?: IUser[];
}
