import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from './entities/product.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries/handlers';
import { CommandHandlers } from './commands/handlers';
import { CustomLoggerService } from '../common/Logger/customerLogger.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ProductsEntity])],
  controllers: [ProductsController],
  providers: [...CommandHandlers, ...QueryHandlers, CustomLoggerService],
})
export class ProductsModule {}
