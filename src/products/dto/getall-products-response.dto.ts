import { GetProductResponseDto } from './get-product-response.dto';

export class GetAllProductsResponseDto {
  data: GetProductResponseDto[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
