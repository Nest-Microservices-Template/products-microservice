import { GetProductHandler } from './get-product.handler';
import { GetAllProductsHandler } from './getall-products.handler';
import { ValidateProductsHandler } from './validate-products.handler';

export const QueryHandlers = [
  GetProductHandler,
  GetAllProductsHandler,
  ValidateProductsHandler,
];
