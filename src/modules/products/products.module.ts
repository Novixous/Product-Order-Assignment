import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { productsProvider } from './products.providers';

@Module({
  providers: [ProductsService, ...productsProvider],
  controllers: [ProductsController]
})
export class ProductsModule {}
