import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { CartDto, CartItem } from './dto/cart.dto';

describe('CartsController', () => {
  let controller: CartsController;

  class mockCartService {
    cache = {
      1: {
        userId: 1,
        cartItems: [],
        totalPrice: 0,
      }
    };

    async getCartInfo(userId: number) {
      return this.cache[userId];
    }

    async setCartInfo(userId: number, cart: CartDto) { }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsService],
      controllers: [CartsController],
    }).overrideProvider(CartsService).useClass(mockCartService).compile();

    controller = module.get<CartsController>(CartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return cart info', async () => {
    let userId = 1;
    let req = {
      user: {
        id: 1
      }
    };
    let result = {
      userId: 1,
      cartItems: [],
      totalPrice: 0,
    };
    expect(await controller.getCartInfo(userId, req)).toEqual(result);
  });


  it('should throw exception', async () => {
    let userId = 1;
    let req = {
      user: {
        id: 2
      }
    };
    try {
      expect(await controller.getCartInfo(userId, req)).toThrowError(ForbiddenException);
    } catch (error) {
      expect(error.message).toEqual('You can not view someone else cart.');
    }
  })

  it('should return success message', async () => {
    let userId = 1;
    let req = {
      user: {
        id: 1
      }
    };
    let cart = new CartDto(1, [], 0);
    expect(await controller.setCartInfo(userId, cart, req)).toEqual('Saved cart successfully.')

  })

  it('should throw exception', async () => {
    let userId = 1;
    let req = {
      user: {
        id: 2
      }
    };
    let cart = new CartDto(1, [], 0);
    try {
      expect(await controller.setCartInfo(userId, cart, req)).toThrowError(ForbiddenException);
    } catch (error) {
      expect(error.message).toEqual('You can not modify other people\'s cart!');
    }
  })

});
