import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCommand } from '../impl/create-product.command';
import { ProductsEntity } from '../../entities/product.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { CustomLoggerService } from '../../../common/Logger/customerLogger.service';

@CommandHandler(CreateProductCommand)
export class CreateProductHanlder
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    private readonly _loggerService: CustomLoggerService,
    @InjectRepository(ProductsEntity)
    private readonly repository: Repository<ProductsEntity>,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductsEntity> {
    try {
      //Log the start of the command execution
      this._loggerService.info('[CreateProductHanlder] - Execution started');

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
    this._loggerService.info(`[${CreateProductHanlder.name}] - Created client`);

    const { name, price } = command.createProductRequestDto;
    const product = this.repository.create({
      name,
      price,
    });
    return await this.repository.save(product);
  }
}
