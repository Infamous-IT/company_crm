import { Roles } from '../enums/roles';

export interface IUser {
  id: string;
  email: string;
  role: Roles;
}

export interface IGoogleUser {
  id: string;
  email: string;
  token: string;
  lastName: string;
  firstName: string;
}
