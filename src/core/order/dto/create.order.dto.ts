export class CreateOrderDto {
  userId: string;
  startLng: string;
  startLat: string;
  startAddress: string;
  goalLng: string;
  goalLat: string;
  goalAddress: string;
  status: string;
  priceInfo: string;
}
