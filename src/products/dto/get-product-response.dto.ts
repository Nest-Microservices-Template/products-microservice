import { Expose } from 'class-transformer';

export class GetProductResponseDto {
  @Expose()
  name: string;
  @Expose()
  price: number;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
