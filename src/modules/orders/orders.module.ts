import { Module } from '@nestjs/common';
import { CartsService } from '../carts/carts.service';
import { productsProvider } from '../products/products.providers';
import { OrdersController } from './orders.controller';
import { ordersProvider } from './orders.providers';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, CartsService, ...ordersProvider, ...productsProvider]
})
export class OrdersModule { }
