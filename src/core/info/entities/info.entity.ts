import { Info } from '@prisma/client';

export class InfoEntity implements Info {
  id: string;
  else01: string;
  else02: string;
  exchangeRate: number;
}
