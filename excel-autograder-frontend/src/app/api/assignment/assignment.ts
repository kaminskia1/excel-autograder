import { User } from "../auth-service/auth";

export interface Assignment {
  uuid: string;
  name: string;
  owner: User;
  created_at: string;
  updated_at: string;
  file: File;
  encrypted: boolean;
  data: AssignmentData,
}

export interface AssignmentData {

}
