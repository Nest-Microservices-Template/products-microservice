import { Controller } from '@nestjs/common';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetProductResponseDto } from './dto/get-product-response.dto';
import { CreateProductCommand } from './commands/impl/create-product.command';
import { GetProductQuery } from './queries/impl/get-product.query';
import { GetAllProductsQuery } from './queries/impl/getall-products.query';
import { GetAllProductsResponseDto } from './dto/getall-products-response.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ValidateProductsQuery } from './queries/impl/validate-products.query';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('create_product')
  async createProduct(
    @Payload() createProductDto: CreateProductRequestDto,
  ): Promise<GetProductResponseDto> {
    const response = await this.commandBus.execute(
      new CreateProductCommand(createProductDto),
    );

    // Serializa la respuesta a un objeto JSON puro
    const plainResponse: GetProductResponseDto = JSON.parse(
      JSON.stringify(response),
    );

    console.log('[Products Microservice] Transformed response:', plainResponse);

    return plainResponse; // Retorna un objeto plano, no una clase.
  }

  @MessagePattern('find_one_product')
  async getProduct(@Payload('id') id: string): Promise<GetProductResponseDto> {
    const response = await this.queryBus.execute(new GetProductQuery(id));

    const plainResponse: GetProductResponseDto = JSON.parse(
      JSON.stringify(response),
    );

    console.log('[Products Microservice] Transformed response:', plainResponse);
    return plainResponse;
  }

  @MessagePattern('find_all_products')
  async getAllProducts(
    @Payload() paginationDto: PaginationDto,
  ): Promise<GetAllProductsResponseDto> {
    console.log(
      '[Products Microservice] Handling find_all_products request:',
      paginationDto,
    );
    const response = await this.queryBus.execute(
      new GetAllProductsQuery(paginationDto),
    );

    console.log('[Products Microservice] Returning response:', response);

    const plainResponse: GetAllProductsResponseDto = JSON.parse(
      JSON.stringify(response),
    );
    return plainResponse;
  }

  @MessagePattern('validate_products')
  async validateProduct(@Payload() ids: string[]) {
    const response = await this.queryBus.execute(
      new ValidateProductsQuery(ids),
    );

    const plainResponse = JSON.parse(JSON.stringify(response));

    console.log('[Products Microservice] Transformed response:', plainResponse);
    return plainResponse;
  }

  @EventPattern('order_created')
  async handleOrderCreated(data: any) {
    // Manejar el evento
    console.log('Order created:', data);
  }
}
