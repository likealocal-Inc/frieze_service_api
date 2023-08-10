import { Payment } from '@prisma/client';

export class PaymentEntity implements Payment {
  id: string;
  orderId: string;
  created: Date;
  updated: Date;
  email: string;
  amt: number;
  merchantID: string;
  ediDate: string;
  signData: string;
  moid: string;
  paymentToken: string;
  tempKey: string;

  authToken: string;
  signature: string;
  txTid: string;

  successInfo: string;
}
