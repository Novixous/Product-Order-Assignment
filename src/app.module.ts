import { CacheModule, Module } from '@nestjs/common';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthService } from './modules/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { CartsModule } from './modules/carts/carts.module';
import { OrdersModule } from './modules/orders/orders.module';
import * as redisStore from 'cache-manager-redis-store';
import { AppService } from './app.service';
import { productsProvider } from './modules/products/products.providers';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    ProductsModule,
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
    CacheModule.register({
      store: redisStore,
      socket: {
        host: 'localhost',
        port: 6379
      },
      isGlobal: true
    }),
    CartsModule,
    OrdersModule],
  controllers: [],
  providers: [
    AppService, 
    AuthService,
    ...productsProvider
  ],
})
export class AppModule { }
