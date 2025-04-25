import {User} from "./user";

export interface ContactDto {
  uid: string;
  user: User;
  nickname?: string
}
