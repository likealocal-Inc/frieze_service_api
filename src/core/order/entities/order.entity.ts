import { Order } from '@prisma/client';

export class OrderEntity implements Order {
  id: string;
  created: Date;
  updated: Date;
  userId: string;
  startLng: string;
  startLat: string;
  // start: string;
  goalLng: string;
  goalLat: string;
  // goal: string;
  totalPrice: number;
  status: string;
  approvalDate: string;
}
