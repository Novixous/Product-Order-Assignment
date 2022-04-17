import { Module } from '@nestjs/common';
import { databaseProviders } from '../../core/database/database.providers';
import { CartsService } from '../carts/carts.service';
import { productsProvider } from '../products/products.providers';
import { OrdersController } from './orders.controller';
import { ordersProvider } from './orders.providers';
import { OrdersService } from './orders.service';
// import { PuppeteerModule } from 'nest-puppeteer';

@Module({
  imports: [
    // PuppeteerModule.forRoot({ executablePath: '/usr/bin/chromium-browser', ignoreDefaultArgs: ['--no-sandbox'] })
  ],
  controllers: [OrdersController],
  providers: [OrdersService, CartsService, ...ordersProvider, ...productsProvider, ...databaseProviders]
})
export class OrdersModule { }
