import { User } from '../auth-service/auth';
import { Question } from '../../question/question';

export interface Assignment {
  readonly uuid: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly owner: User;
  name: string;
  file: string;
  encrypted: boolean;
  questions: Array<Question>
  _file?: Blob;
  _key?: string;
}
