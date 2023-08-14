import { Manager } from '@prisma/client';

export class ManagerEntity implements Manager {
  id: string;
  created: Date;
  updated: Date;
  name: string;
  email: string;
  password: string;
  else01: string;
  else02: string;
  lastLoginDate: string;
}
