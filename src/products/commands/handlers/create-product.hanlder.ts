import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCommand } from '../impl/create-product.command';
import { ProductsEntity } from '../../entities/product.entity';
import { InternalServerErrorException } from '@nestjs/common';

@CommandHandler(CreateProductCommand)
export class CreateProductHanlder
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    // private readonly _loggerService: LoggerService,
    @InjectRepository(ProductsEntity)
    private readonly repository: Repository<ProductsEntity>,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductsEntity> {
    try {
      //Log the start of the command execution
      // this._loggerService.info('[CreateCustomerCommand] - Execution started');

      return await this.createProduct(command);
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred: ' + error.message,
      );
    }
  }

  private async createProduct(
    command: CreateProductCommand,
  ): Promise<ProductsEntity> {
    // this._loggerService.info(
    //     `[${CreateCustomerHanlder.name}] - Created client`,
    //   );

    const { productId, name, price } = command.createProductRequestDto;
    const product = this.repository.create({
      productId,
      name,
      price,
    });
    return await this.repository.save(product);
  }
}
