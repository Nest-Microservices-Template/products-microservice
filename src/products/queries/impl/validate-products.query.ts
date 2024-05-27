import { IQuery } from '@nestjs/cqrs';

export class ValidateProductsQuery implements IQuery {
  constructor(public readonly ids: string[]) {}
}
