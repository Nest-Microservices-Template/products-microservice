import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateProductRequestDto {
  @IsString()
  public productId: string;

  @IsString()
  public name: string;

  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @Min(0)
  @Type(() => Number)
  public price: number;
}
