import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { ORDER_REPOSITORY, PRODUCT_REPOSITORY } from 'src/core/constants';
import { CartsService } from '../carts/carts.service';
import { CartDto } from '../carts/dto/cart.dto';
import { Product } from '../products/product.entity';
import { Role } from '../users/dto/user.dto';
import { User } from '../users/user.entity';
import { OrderProduct } from './dto/order_product.dto';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
    constructor(
        @Inject(ORDER_REPOSITORY) private readonly orderRepository: typeof Order,
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: typeof Product,
        private readonly cartService: CartsService) { }

    async findAll(user: User): Promise<Order[]> {
        const { role } = user;
        let where = {};
        switch (role) {
            case Role.USER:
                where = { userId: user.id }
                break;
            case Role.VENDOR:
                //not yet implemented
                where = { userId: user.id }
                break;
        }
        return await this.orderRepository.findAll<Order>({
            include: [{ model: User, attributes: { exclude: ['password'] } }],
            where
        });
    }

    async createOrder(cart: CartDto, userId: number) {
        const productIds = cart.cartItems.map(cartItem => cartItem.productId);
        const productMap = await this.getProductMap(productIds);
        let products = cart.cartItems.map(cartItem => {
            let tmpProduct = productMap.get(cartItem.productId);
            return new OrderProduct(cartItem.productId, tmpProduct.name, tmpProduct.price, cartItem.quantity, cartItem.quantity * tmpProduct.price);
        })
        let totalPrice = products.map(prod => prod.totalPrice).reduce((a, v) => a + v, 0);
        const result = await this.orderRepository.create<Order>({ products, totalPrice, userId });

        await this.cartService.deleteUserCart(userId);
        return result;
    }

    async getProductMap(productIds: number[]): Promise<Map<number, Product>> {
        return await this.productRepository.findAll<Product>({
            where: {
                id: {
                    [Op.in]: productIds
                }
            }
        }).then(products => products.reduce((map, prod) => {
            map.set(prod.id, prod)
            return map;
        }, new Map()));
    }
}
