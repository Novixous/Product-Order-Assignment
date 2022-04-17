import { Test, TestingModule } from '@nestjs/testing';
import { USER_REPOSITORY } from '../../core/constants';
import { Gender, Role, UserDto } from './dto/user.dto';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const user = {
    id: 1,
    name: 'User A'
  }

  const mockUserRepository = {
    create: jest.fn(async () => user),
    findOne: jest.fn(async () => user)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: USER_REPOSITORY,
        useValue: mockUserRepository
      }],
    })
      .overrideProvider(USER_REPOSITORY).useValue(mockUserRepository)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return new user', async () => {
    expect(await service.create(new UserDto('User A', 'mail@mail.mail', '123456', Gender.MALE, Role.USER))).toEqual(user);
  });

  it('should return user', async () => {
    expect(await service.findOneByEmail('')).toEqual(user);
  });

  it('should return user', async () => {
    expect(await service.findOneById(1)).toEqual(user);
  });
});
