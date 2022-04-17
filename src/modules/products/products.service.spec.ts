import { Test, TestingModule } from '@nestjs/testing';
import { PRODUCT_REPOSITORY } from '../../core/constants';
import { Role } from '../users/dto/user.dto';
import { ProductDto } from './dto/product.dto';
import { productsProvider } from './products.providers';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  const userId = 1;

  const productData = [
    { id: 1, name: 'Product 1', price: 350, quantity: 300, description: 'Lorem Ipsum', isDeleted: false, vendorUserId: 1 },
    { id: 2, name: 'Product 2', price: 50, quantity: 300, description: 'Lorem Ipsum', isDeleted: false, vendorUserId: 1 },
    { id: 3, name: 'Product 3', price: 176.6, quantity: 300, description: 'Lorem Ipsum', isDeleted: false, vendorUserId: 1 }
  ]
  const mockProductRepository = {
    findAll: jest.fn(async () => productData),
    findOne: jest.fn(async () => productData[0]),
    create: jest.fn(async () => productData[0]),
    update: jest.fn(async () => {
      const affectedCount = 1;
      const affectedRows = productData[0]
      return [
        affectedCount, [affectedRows]
      ]
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, {
        provide: PRODUCT_REPOSITORY,
        useValue: mockProductRepository
      }],
    })
      .overrideProvider(PRODUCT_REPOSITORY).useValue(mockProductRepository)
      .compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return product', async () => {
    expect(await service.create(new ProductDto('Product 1', 10, 1, 'Description', false), 1)).toEqual(productData[0]);
  });

  it('should return product', async () => {
    expect(await service.findOne(1, userId, Role.USER)).toEqual(productData[0]);
    expect(await service.findOne(1, userId, Role.VENDOR)).toEqual(productData[0]);
  });

  it('should return product', async () => {
    expect(await service.findAll(userId, Role.USER)).toEqual(productData);
    expect(await service.findAll(userId, Role.VENDOR)).toEqual(productData);
  });

  it('should return product', async () => {
    expect(await service.update(1, {}, 1)).toEqual({ numberOfAffectedRows: 1, updatedProduct: productData[0] });
  });

  it('should return product', async () => {
    expect(await service.delete(1, 1)).toEqual({ numberOfAffectedRows: 1, deletedProduct: productData[0] });
  });
});
