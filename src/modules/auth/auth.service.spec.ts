import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const user = {
    id: 1,
    name: 'User A',
    password: '123456'
  }

  const response = {
    user,
    token: ' token'
  }

  const mockUserService = {};
  const mockJwtService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    })
      .overrideProvider(UsersService).useValue(mockUserService)
      .overrideProvider(JwtService).useValue(mockJwtService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should return user and token', async () => {

  //   expect(await service.create(user)).toEqual(response);
  // });
});
