import { Gender, Role, User } from '@prisma/client';

export class CUserEntity implements User {
  id: number;
  created: Date;
  updated: Date;
  name: string;
  email: string;
  password: string;
  phone: string;
  gender: Gender;
  isActive: boolean;
  profileImgId: number;
  role: Role;
}
