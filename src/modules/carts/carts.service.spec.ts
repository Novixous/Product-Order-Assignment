import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PRODUCT_REPOSITORY } from '../../core/constants';
import { CartsService } from './carts.service';
import { CartDto, CartItem } from './dto/cart.dto';

describe('CartsService', () => {
  let service: CartsService;
  const cartDto = new CartDto(1, [new CartItem(1, 3)], 1050);

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
  }
  const mockCache = {
    get: (key: string) => key === 'cart-1' ? cartDto : null,
    set: () => jest.fn(),
    del: () => jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCache
        },
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository
        }
      ],
    })
      .overrideProvider(PRODUCT_REPOSITORY).useValue(mockProductRepository)
      .overrideProvider(CACHE_MANAGER).useValue(mockCache)
      .compile();

    service = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set cart info', async () => {
    expect(await service.setCartInfo(1, cartDto))
  });

  it('should get cart info', async () => {
    expect(await service.getCartInfo(1)).toEqual(cartDto);
  });

  it('should receive no error', async () => {
    expect(await service.deleteUserCart(1));
  });
});
