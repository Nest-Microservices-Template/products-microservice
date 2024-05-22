import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllProductsQuery } from '../impl/getall-products.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from '../../entities/product.entity';
import { Repository } from 'typeorm';
import { GetAllProductsResponseDto } from '../../dto/getall-products-response.dto';
import { GetProductResponseDto } from '../../dto/get-product-response.dto';
import { InternalServerErrorException } from '@nestjs/common';

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler
  implements IQueryHandler<GetAllProductsQuery>
{
  constructor(
    // private readonly _loggerService: LoggerService,
    @InjectRepository(ProductsEntity)
    private readonly repository: Repository<ProductsEntity>,
  ) {}

  async execute(
    query: GetAllProductsQuery,
  ): Promise<GetAllProductsResponseDto> {
    try {
      //   this._loggerService.info(
      //     `[${GetAllCustomersHandler.name}] - Starting execution`,
      //   );

      const products = await this.repository.find();

      const responseDto = new GetAllProductsResponseDto();

      responseDto.products = products.map((product) => {
        const productsDto = new GetProductResponseDto();
        productsDto.productId = product.productId;
        productsDto.name = product.name;
        productsDto.price = product.price;
        productsDto.createdAt = product.createdAt;
        productsDto.updatedAt = product.updatedAt;

        return productsDto;
      });

      return responseDto;
    } catch (error) {
      //   this._loggerService.error(
      //     `[${GetAllCustomersHandler.name}] - Error: ${error.message}`,
      //   );
      throw new InternalServerErrorException(
        'An error occurred: ' + error.message,
      );
    }
  }
}
