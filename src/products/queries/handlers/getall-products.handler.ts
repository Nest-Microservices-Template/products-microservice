import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllProductsQuery } from '../impl/getall-products.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from '../../entities/product.entity';
import { Repository } from 'typeorm';
import { GetAllProductsResponseDto } from '../../dto/getall-products-response.dto';
import { GetProductResponseDto } from '../../dto/get-product-response.dto';
import { HttpStatus } from '@nestjs/common';
import { CustomLoggerService } from '../../../common/Logger/customerLogger.service';
import { RpcException } from '@nestjs/microservices';

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler
  implements IQueryHandler<GetAllProductsQuery>
{
  constructor(
    private readonly _loggerService: CustomLoggerService,
    @InjectRepository(ProductsEntity)
    private readonly repository: Repository<ProductsEntity>,
  ) {}

  async execute(
    query: GetAllProductsQuery,
  ): Promise<GetAllProductsResponseDto> {
    try {
      this._loggerService.info(
        `[${GetAllProductsHandler.name}] - Starting execution`,
      );
      const { page = 1, limit = 10 } = query.pagination || {};
      const [products, total] = await this.repository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });

      const responseDto = new GetAllProductsResponseDto();
      responseDto.data = products.map((product) => {
        const productsDto = new GetProductResponseDto();
        productsDto.name = product.name;
        productsDto.price = product.price;
        productsDto.createdAt = product.createdAt;
        productsDto.updatedAt = product.updatedAt;

        return productsDto;
      });

      responseDto.meta = {
        total: total,
        page: page,
        lastPage: Math.ceil(total / limit),
      };

      return responseDto;
    } catch (error) {
      this._loggerService.error(
        `[${GetAllProductsHandler.name}] - Error: ${error.message}`,
      );
      throw new RpcException({
        message: 'An error occurred: ' + error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
