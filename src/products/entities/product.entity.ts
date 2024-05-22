import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base/base.entity';

@Entity({ name: 'products', schema: 'e_products' })
export class ProductsEntity extends BaseEntity {
  @Column({ name: 'product_id', unique: true })
  productId: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'price' })
  price: number;
}
