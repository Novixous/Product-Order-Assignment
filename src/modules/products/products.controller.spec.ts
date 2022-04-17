import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductDto } from './dto/product.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  const req = { user: { id: 1 } }

  const productData = [
    { id: 1, name: 'Product 1', price: 350, quantity: 300, description: 'Lorem Ipsum', isDeleted: false, vendorUserId: 1 },
    { id: 2, name: 'Product 2', price: 50, quantity: 300, description: 'Lorem Ipsum', isDeleted: false, vendorUserId: 1 },
    { id: 3, name: 'Product 3', price: 176.6, quantity: 300, description: 'Lorem Ipsum', isDeleted: false, vendorUserId: 1 }
  ]
  const mockProductService = {
    findAll: jest.fn(async () => productData),
    findOne: jest.fn(async (id) => id === 1 ? productData[0] : null),
    create: jest.fn(async () => productData[0]),
    delete: jest.fn(async (id) => {
      return id === 1 ? {
        numberOfAffectedRows: 1,
        deletedProduct: productData[0]
      } : {
        numberOfAffectedRows: 0,
        deletedProduct: null
      }
    }),
    update: jest.fn(async (id) => {
      return id === 1 ? {
        numberOfAffectedRows: 1,
        updatedProduct: productData[0]
      } : {
        numberOfAffectedRows: 0,
        updatedProduct: null
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
      controllers: [ProductsController],
    }).overrideProvider(ProductsService).useValue(mockProductService).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return product data', async () => {
    expect(await controller.findAll(req)).toEqual(productData);
  });

  it('should return product data case 1 and throw error case 2', async () => {
    expect(await controller.findOne(1, req)).toEqual(productData[0]);
    try {
      expect(await controller.findOne(9, req)).toThrow(NotFoundException);
    } catch (error) {
      expect(error.message).toEqual('This product doesn\'t exist or you have no permission to view');
    }

  });

  it('should return product data case 1 and throw error case 2', async () => {
    expect(await controller.update(1, new ProductDto('Product 1', 10, 1, 'Description', false), req)).toEqual(productData[0]);
    try {
      expect(await controller.update(2, new ProductDto('Product 1', 10, 1, 'Description', false), req)).toThrow(NotFoundException);
    } catch (error) {
      expect(error.message).toEqual('This Product doesn\'t exist or you don\'t have permission to edit this product.');
    }
  });

  it('should return product data', async () => {
    expect(await controller.create(new ProductDto('Product 1', 10, 1, 'Description', false), req)).toEqual(productData[0]);
  });

  it('should return product data case 1 and throw error case 2', async () => {
    expect(await controller.remove(1, req)).toEqual(productData[0]);
    try {
      expect(await controller.remove(2, req)).toThrow(NotFoundException);
    } catch (error) {
      expect(error.message).toEqual('This Product doesn\'t exist or you don\'t have permission to delete this product.');
    }
  });
});
