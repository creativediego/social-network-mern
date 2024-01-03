import IUser from '../users/IUser';
import { ChatType } from './ChatType';

/**
 * Model interface for a conversation used for the messages resource.
 */
export default interface IChat {
  id: string;
  type: ChatType;
  creatorId: string;
  participants: IUser[];
  deletedBy: string[];
  readBy: string[];
}
