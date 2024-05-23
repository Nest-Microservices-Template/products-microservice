import { IQuery } from '@nestjs/cqrs';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class GetAllProductsQuery implements IQuery {
  constructor(public pagination: PaginationDto) {}
}
