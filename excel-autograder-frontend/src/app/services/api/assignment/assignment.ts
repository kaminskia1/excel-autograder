import { User } from "../auth-service/auth";
import { Question } from "../../question/question";

export interface Assignment {
  uuid: string;
  name: string;
  owner: User;
  created_at: string;
  updated_at: string;
  file: string;
  encrypted: boolean;
  questions: Array<Question>
}
