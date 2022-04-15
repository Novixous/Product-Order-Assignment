import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from './core/constants';
import { AuthService } from './modules/auth/auth.service';
import { Product } from './modules/products/product.entity';
import { Gender, Role, UserDto } from './modules/users/dto/user.dto';
import { SEED_PRODUCTS } from './seed/product.seed';
import { SEED_USERS } from './seed/user.seed';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepository: typeof Product, private authService: AuthService) { }
  onApplicationBootstrap() {
    if (process.env.SEED === 'true') {
      this.seed();
    }
  }

  async seed() {
    let vendors = []
    for (const u of SEED_USERS) {
      console.log('Seeding user data.');
      const { user } = await this.authService.create(u);
      if (user.role === Role.VENDOR) {
        vendors.push(user);
      }
      console.log('Completed Seeding users.');
    }
    for (const prod of SEED_PRODUCTS) {
      let index = Math.floor(Math.random() * (vendors.length - 0) + 0);
      this.productRepository.create({ ...prod, vendorUserId: vendors[index].id })
    }
  }
}
