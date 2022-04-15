import { Module } from '@nestjs/common';
import { productsProvider } from '../products/products.providers';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';

@Module({
  controllers: [CartsController],
  providers: [CartsService, ...productsProvider],
})
export class CartsModule {}
