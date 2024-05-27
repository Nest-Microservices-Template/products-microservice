import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductsEntity } from '../../entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CustomLoggerService } from '../../../common/Logger/customerLogger.service';
import { ValidateProductsQuery } from '../impl/validate-products.query';

@QueryHandler(ValidateProductsQuery)
export class ValidateProductsHandler
  implements IQueryHandler<ValidateProductsQuery>
{
  constructor(
    private readonly _loggerService: CustomLoggerService,
    @InjectRepository(ProductsEntity)
    private readonly repository: Repository<ProductsEntity>,
  ) {}

  async execute(query: ValidateProductsQuery): Promise<ProductsEntity[]> {
    try {
      this._loggerService.info(
        `[${
          ValidateProductsHandler.name
        }] - Starting execution for query ${JSON.stringify(query)}`,
      );

      const uniqueIds = this.removeDuplicates(query.ids);
      const products = await this.findProductsByIds(uniqueIds);

      if (products.length !== uniqueIds.length) {
        throw new RpcException({
          message: 'Some products were not found',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return products;
    } catch (error) {
      this._loggerService.error(
        `[${ValidateProductsHandler.name}] - Error executing query ${JSON.stringify(
          query,
        )}. Error: ${error.message}`,
      );

      throw new RpcException({
        message: 'An error occurred: ' + error.message,
        status: HttpStatus.NOT_FOUND,
      });
    }
  }

  private removeDuplicates(ids: string[]): string[] {
    return Array.from(new Set(ids));
  }

  private async findProductsByIds(ids: string[]): Promise<ProductsEntity[]> {
    return this.repository.findByIds(ids);
  }
}
