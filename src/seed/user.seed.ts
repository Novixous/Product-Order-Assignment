import { Gender, Role, UserDto } from "../modules/users/dto/user.dto";

export const SEED_USERS = [
    new UserDto('First vendor', 'vendor1g@gmail.com', '123456', Gender.MALE, Role.VENDOR),
    new UserDto('Second vendor', 'vendor2g@gmail.com', '123456', Gender.FEMALE, Role.VENDOR),
    new UserDto('Third vendor', 'vendor3g@gmail.com', '123456', Gender.MALE, Role.VENDOR),
    new UserDto('First user', 'user1g@gmail.com', '123456', Gender.FEMALE, Role.USER),
    new UserDto('Second user', 'user2g@gmail.com', '123456', Gender.MALE, Role.USER),
]