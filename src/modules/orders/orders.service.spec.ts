import { Test, TestingModule } from '@nestjs/testing';
import { ORDER_REPOSITORY, PRODUCT_REPOSITORY } from '../../core/constants';
import { CartsService } from '../carts/carts.service';
import { OrdersService } from './orders.service';
import { PuppeteerModule } from 'nest-puppeteer';
import { TransactionInterceptor } from '../../core/database/transaction.interceptor';
import { Transaction } from 'sequelize/types';
import { CartDto, CartItem } from '../carts/dto/cart.dto';
import { Gender, Role } from '../users/dto/user.dto';
import { OrderFilterDto } from './dto/order_filter.dto';
import { BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  const userId = 1;
  const user = {
    userId,
    email: '',
    password: '',
    gender: Gender.MALE,
    role: Role.USER
  }

  const vendor = {
    userId: 2,
    email: '',
    password: '',
    gender: Gender.MALE,
    role: Role.VENDOR
  }

  const order = {
    id: 1,
  }

  const orderDetailDto = {
    cart: new CartDto(1, [
      new CartItem(1, 2),
      new CartItem(2, 2),
      new CartItem(3, 2)
    ], 1153.2),
    customerAddress: 'Address',
    customerZipcode: 123456,
    customerCountry: 'US'
  }

  const mockOrderRepository = {
    create: jest.fn(async () => order),
    findAll: jest.fn(async () => [order]),
    findOne: jest.fn(async () => order)
  };

  const productData = [
    { id: 1, name: 'Product 1', price: 350, quantity: 300, description: 'Lorem Ipsum', isDeleted: false, vendorUserId: 1 },
    { id: 2, name: 'Product 2', price: 50, quantity: 300, description: 'Lorem Ipsum', isDeleted: false, vendorUserId: 1 },
    { id: 3, name: 'Product 3', price: 176.6, quantity: 300, description: 'Lorem Ipsum', isDeleted: false, vendorUserId: 1 }
  ]

  const mockProductRepository = {
    findAll: jest.fn(async () => productData),
    findOne: jest.fn(async () => productData[0]),
    create: jest.fn(async () => productData[0]),
    remove: jest.fn(async () => productData[0]),
    update: jest.fn()
  }
  const mockCartService = {
    deleteUserCart: jest.fn()
  }
  const mockTransactionInterceptor = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PuppeteerModule.forRoot()],
      providers: [
        OrdersService,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository
        },
        {
          provide: ORDER_REPOSITORY,
          useValue: mockOrderRepository
        }, CartsService],
    })
      .overrideProvider(ORDER_REPOSITORY).useValue(mockOrderRepository)
      .overrideProvider(PRODUCT_REPOSITORY).useValue(mockProductRepository)
      .overrideProvider(CartsService).useValue(mockCartService)
      .overrideInterceptor(TransactionInterceptor).useValue(mockTransactionInterceptor)
      .compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return order', async () => {
    expect(await service.createOrder(orderDetailDto, userId, {} as Transaction)).toEqual(order);
  });

  it('should be return order', async () => {
    expect(await service.findAll(user.userId, user.role)).toEqual([order]);
    expect(await service.findAll(vendor.userId, vendor.role)).toEqual([order]);
  });

  it('should run without throwing error', async () => {
    expect(await service.getRecepitPDF(user.userId, order.id))

  });

  it('should run without throwing error', async () => {
    let filter = new OrderFilterDto();
    filter.where = {}
    filter.attributes = ['id'];
    expect(await service.getCSV(filter, user.userId))
    filter.where = { userId: 1 }
    expect(await service.getCSV(filter, user.userId))
  });

  it('should be return order', async () => {
    productData[0].quantity = 1;
    try {
      expect(await service.createOrder(orderDetailDto, userId, {} as Transaction)).toThrow(BadRequestException);
    } catch (error) {
      expect(error.message).toEqual('Quantity exceeds stock!');
    }
  });
});
