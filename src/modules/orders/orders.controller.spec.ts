import { Test, TestingModule } from '@nestjs/testing';
import { TransactionInterceptor } from '../../core/database/transaction.interceptor';
import { OrderFilterDto } from './dto/order_filter.dto';
import { OrderProductDto } from './dto/order_product.dto';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import * as httpMock from 'node-mocks-http';
import { OrderDetailDto } from './dto/order_detail.dto';
import { Transaction } from 'sequelize/types';
describe('OrdersController', () => {
  let controller: OrdersController;
  const customerAddress = 'Address';
  const customerZipcode = 700;
  const customerCountry = 'US';
  const req = { user: { userId: 1 } }

  const orders = [
    {
      id: 1,
      products: [
        new OrderProductDto(1, 'Product 1', 10, 2, 20),
        new OrderProductDto(2, 'Product 2', 20, 3, 60)
      ],
      totalPrice: 80,
      customerAddress,
      customerZipcode,
      customerCountry,
      userId: 1,
      user: {
        userId: 1
      }
    },
    {
      id: 2,
      products: [
        new OrderProductDto(1, 'Product 1', 10, 3, 30),
        new OrderProductDto(2, 'Product 2', 20, 3, 60)
      ],
      totalPrice: 90,
      customerAddress,
      customerZipcode,
      customerCountry,
      userId: 1,
      user: {
        userId: 1
      }
    }
  ]

  const mockOrderService = {
    findAll: async () => orders,
    getCSV: async () => jest.fn(),
    getRecepitPDF: async () => Buffer.from('dummy text', 'utf8'),
    createOrder: async () => orders[0]
  };
  const mockTransactionInterceptor = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService],
    })
      .overrideProvider(OrdersService).useValue(mockOrderService)
      .overrideInterceptor(TransactionInterceptor).useValue(mockTransactionInterceptor)
      .compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('it should return orders', async () => {
    expect(await controller.findAll(req)).toEqual(orders);
  });

  it('it should not receive any error', async () => {

    const filterDto = new OrderFilterDto();
    const res = httpMock.createResponse();
    expect(await controller.getCSV(req, filterDto, res));
  });

  it('it should not receive any error', async () => {

    const res = httpMock.createResponse();
    expect(await controller.getReceiptPDF(1, req, res));
  });

  it('it should return object', async () => {

    const res = httpMock.createResponse();
    expect(await controller.createOrders(req, new OrderDetailDto(), {} as Transaction)).toEqual(orders[0]);
  });
});
