import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { ProductsModule } from './modules/products/products.module';
import { productsProvider } from './modules/products/products.providers';
import { AuthService } from './modules/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot({ isGlobal: true }), UsersModule, AuthModule, PostsModule, ProductsModule, JwtModule.register({
    secret: process.env.JWTKEY,
    signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
  })],
  controllers: [],
  providers: [
    AppService, AuthService, ...productsProvider
  ],
})
export class AppModule { }
