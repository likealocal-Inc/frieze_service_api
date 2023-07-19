import { User } from '@prisma/client';

export class CUserEntity implements User {
  id: string;
  created: Date;
  updated: Date;
  name: string;
  email: string;
  isAuth: boolean;
  else01: string;
  else02: string;
}
