import { Controller } from '@nestjs/common';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetProductResponseDto } from './dto/get-product-response.dto';
import { CreateProductCommand } from './commands/impl/create-product.command';
import { GetProductQuery } from './queries/impl/get-product.query';
import { GetAllProductsQuery } from './queries/impl/getall-products.query';
import { GetAllProductsResponseDto } from './dto/getall-products-response.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  // @Post('')
  @MessagePattern({ cmd: 'create_product' })
  async createProduct(
    @Payload() createProductDto: CreateProductRequestDto,
  ): Promise<GetProductResponseDto> {
    return await this.commandBus.execute(
      new CreateProductCommand(createProductDto),
    );
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  async getProduct(@Payload('id') id: string): Promise<GetProductResponseDto> {
    return await this.queryBus.execute(new GetProductQuery(id));
  }

  // @Get('')
  @MessagePattern({ cmd: 'find_all_products' })
  async getAllProducts(): Promise<GetAllProductsResponseDto> {
    return await this.queryBus.execute(new GetAllProductsQuery());
  }
}