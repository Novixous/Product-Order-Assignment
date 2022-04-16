import { BadRequestException, Inject, Injectable, ParseArrayPipe, UseInterceptors } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Op } from 'sequelize';
import { ORDER_REPOSITORY, PRODUCT_REPOSITORY } from 'src/core/constants';
import { TransactionParam } from 'src/core/database/transaction-param.decorator';
import { TransactionInterceptor } from 'src/core/database/transaction.interceptor';
import { CartsService } from '../carts/carts.service';
import { Product } from '../products/product.entity';
import { Role } from '../users/dto/user.dto';
import { User } from '../users/user.entity';
import { OrderProductDto } from './dto/order_product.dto';
import { Order } from './order.entity';
import { InjectBrowser } from 'nest-puppeteer';
import type { Browser } from 'puppeteer';
import hbs from 'handlebars';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as moment from 'moment';
import { OrderDetailDto } from './dto/order_detail.dto';
import { OrderFilterDto } from './dto/order_filter.dto';
import { Parser } from 'json2csv';

@Injectable()
export class OrdersService {
    constructor(
        @Inject(ORDER_REPOSITORY) private readonly orderRepository: typeof Order,
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: typeof Product,
        @InjectBrowser() private readonly browser: Browser,
        private readonly cartService: CartsService) { }

    async getRecepitPDF(user: User, orderId: number): Promise<Buffer> {
        const order = await this.findOne(orderId, user.id);
        const date = moment(order.createdAt).utcOffset('+0000').format('DD/MM/YYYY HH:mm:ss z');
        const data = { date, order: { ...order } }
        return await this.generatePDF(data);
    }

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

    async getCSV(filter: OrderFilterDto, userId: number) {
        const { where, attributes } = filter;
        if (userId in where) {
            where.userId = userId;
        }
        const orders = await this.orderRepository.findAll<Order>({
            include: [{ model: User, attributes: { exclude: ['password'] } }],
            where,
            attributes,
            raw: true
        });
        const parser = new Parser({ fields: attributes });
        const data = [];
        orders.forEach(order => {
            let tmp = {};
            attributes.forEach(field => {
                tmp[field] = order[field];
            })
            data.push(tmp);
        })
        return parser.parse(data);
    }

    async findOne(id: number, userId: number): Promise<Order> {
        return await this.orderRepository.findOne({
            where: { id, userId },
            include: [{ model: User, attributes: { exclude: ['password'] } }],
            raw: true
        });
    }

    @UseInterceptors(TransactionInterceptor)
    async createOrder(orderDetail: OrderDetailDto, userId: number, @TransactionParam() transaction: Transaction) {
        const { cart } = orderDetail;

        const customerInfo = {
            customerAddress: orderDetail.customerAddress,
            customerCountry: orderDetail.customerCountry,
            customerZipcode: orderDetail.customerZipcode
        }
        const productIds = cart.cartItems.map(cartItem => cartItem.productId);
        const productMap = await this.getProductMap(productIds);
        let products = cart.cartItems.map(cartItem => {
            const tmpProduct = productMap.get(cartItem.productId);
            return new OrderProductDto(cartItem.productId, tmpProduct.name, tmpProduct.price, cartItem.quantity, cartItem.quantity * tmpProduct.price);
        })
        let totalPrice = products.map(prod => prod.totalPrice).reduce((a, v) => a + v, 0);
        const result = await this.orderRepository.create<Order>({ products, totalPrice, userId, ...customerInfo }, { transaction });

        const productsToBeUpdated = cart.cartItems.map(cartItem => {
            const tmpProduct = productMap.get(cartItem.productId);
            const newQuantity = tmpProduct.quantity - cartItem.quantity;
            return { newQuantity, productId: cartItem.productId };
        })

        if (productsToBeUpdated.some(prod => prod.newQuantity < 0)) {
            throw new BadRequestException('Quantity exceeds stock!');
        }

        const productUpdatePromises = productsToBeUpdated.map(prod => {
            return this.productRepository.update({ quantity: prod.newQuantity }, { where: { id: prod.productId }, transaction });
        })

        await Promise.all(productUpdatePromises);

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

    async compile(templateName: string, data: any) {
        const filePath = path.join(process.cwd(), 'src/templates', `${templateName}.hbs`);
        const html = await fs.readFile(filePath, 'utf-8');
        return hbs.compile(html)(data);
    }

    async generatePDF(data: any): Promise<Buffer> {
        const page = await this.browser.newPage();
        const content = await this.compile('receipt.template', data);

        await page.setContent(content);
        await page.emulateMediaType('screen');
        const pdf = await page.pdf({
            format: 'a4',
            printBackground: true
        })
        page.close()
        return pdf;
    }
}
