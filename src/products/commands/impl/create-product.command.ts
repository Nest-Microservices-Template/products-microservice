import { ICommand } from '@nestjs/cqrs';
import { CreateProductRequestDto } from '../../dto/create-product-request.dto';

export class CreateProductCommand implements ICommand {
  constructor(
    public readonly createProductRequestDto: CreateProductRequestDto,
  ) {}
}
