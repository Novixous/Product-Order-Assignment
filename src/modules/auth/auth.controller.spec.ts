import { Test, TestingModule } from '@nestjs/testing';
import { DoesUserExist } from '../../core/guards/doesUserExist.guard';
import { Gender, Role, UserDto } from '../users/dto/user.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const req = {};
  const response = {
    user: { id: 1 },
    token: 'token'
  }
  const mockAuthService = {
    login: jest.fn(async () => response),
    create: jest.fn(async () => response)
  };

  const mockDoesUserExist = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      controllers: [AuthController],
    }).overrideProvider(AuthService).useValue(mockAuthService)
      .overrideGuard(DoesUserExist).useValue(mockDoesUserExist).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user and token', async () => {
    expect(await controller.login(req)).toEqual(response);
  });

  it('should return user and token', async () => {
    expect(await controller.signUp(new UserDto('User A', 'mail@mail.mail', '123456', Gender.MALE, Role.USER))).toEqual(response);
  });
});
