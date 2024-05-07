import { IUser } from '../../../user/models/IUser';
import { ChatType } from './ChatType';

/**
 * Model interface for a conversation used for the messages resource.
 */
export interface IChat {
  id: string;
  type: ChatType;
  creatorId: string;
  participants: IUser[];
  deletedBy: string[];
  readBy: string[];
}
