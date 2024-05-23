import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductQuery } from '../impl/get-product.query';
import { ProductsEntity } from '../../entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProductResponseDto } from '../../dto/get-product-response.dto';
import { NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CustomLoggerService } from '../../../common/Logger/customerLogger.service';

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
  constructor(
    private readonly _loggerService: CustomLoggerService,
    @InjectRepository(ProductsEntity)
    private readonly repository: Repository<ProductsEntity>,
  ) {}

  async execute(query: GetProductQuery): Promise<GetProductResponseDto> {
    try {
      this._loggerService.info(
        `[${
          GetProductHandler.name
        }] - Starting execution for query ${JSON.stringify(query)}`,
      );

      //Get product
      const product = await this.getProduct(query.id);

      //return product;
      const responseDto = new GetProductResponseDto();
      responseDto.productId = product.productId;
      responseDto.name = product.name;
      responseDto.price = product.price;
      responseDto.createdAt = product.createdAt;
      responseDto.updatedAt = product.updatedAt;

      return responseDto;
    } catch (error) {
      this._loggerService.error(
        `[${GetProductHandler.name}] - Error executing query ${JSON.stringify(
          query,
        )}. Error: ${error.message}`,
      );

      throw new RpcException('An error occurred: ' + error.message);
    }
  }

  private async getProduct(productId: string) {
    this._loggerService.info(
      `[${GetProductHandler.name}] - Retrieving product ${productId}`,
    );

    const product: ProductsEntity = await this.repository.findOne({
      where: { productId: productId },
    });

    if (!product) {
      this._loggerService.error(
        `[${GetProductHandler.name}] - Customer ${productId} does not found`,
      );

      throw new NotFoundException(`Customer with ID ${productId} not found.`);
    }

    return product;
  }
}
