import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Op } from 'sequelize';
import { PRODUCT_REPOSITORY } from 'src/core/constants';
import { Product } from '../products/product.entity';
import { CartDto, CartItem } from './dto/cart.dto';

@Injectable()
export class CartsService {
    constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepository: typeof Product, @Inject(CACHE_MANAGER) private readonly cacheManager: Cache) { }

    async getTotalPrice(cartItems: CartItem[]): Promise<number> {
        const productIds = cartItems.map(p => p.productId);
        let productPriceMap = await this.getProductPriceMap(productIds);
        const totalPrice = cartItems.map(cartItem => cartItem.quantity * productPriceMap[cartItem.productId]).reduce((a, v) => a + v, 0);
        return totalPrice;
    }

    async getCartInfo(userId: number): Promise<CartDto> {
        let key = `cart-${userId}`;
        let cart: CartDto = await this.cacheManager.get(key);
        if (!cart) {
            cart = new CartDto(userId, [], 0);
            await this.cacheManager.set(key, cart, { ttl: 0 });
        }
        return cart;
    }

    async setCartInfo(userId: number, cart: CartDto) {
        let key = `cart-${userId}`;
        cart.userId = userId;
        cart.totalPrice = await this.getTotalPrice(cart.cartItems);;
        await this.cacheManager.set(key, cart, { ttl: 0 });
    }

    async getProductPriceMap(productIds: number[]): Promise<{}> {
        return await this.productRepository.findAll<Product>({
            where: {
                id: {
                    [Op.in]: productIds
                }
            }
        }).then(products => products.reduce((map, prod) => {
            map[prod.id] = prod.price
            return map;
        }, {}));
    }

    async deleteUserCart(userId: number) {
        let key = `cart-${userId}`;
        await this.cacheManager.del(key);
    }
}
