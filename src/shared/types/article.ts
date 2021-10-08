import { User } from './user';

export interface Article {
  id: string;
  title: string;
  description: string;
  createDate: string;
  updateDate: string;
  user: User;
}
