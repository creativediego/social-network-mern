import { ITuit } from './ITuit';
import { IUser } from './IUser';

export interface ISearchResults {
  tuits: ITuit[];
  users: IUser[];
}
