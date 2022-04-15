import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, IsEmail, IsEnum } from 'class-validator';

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

export enum Role {
    USER = 'user',
    VENDOR = 'vendor'
}

export class UserDto {

    constructor(name: string, email: string, password: string, gender: Gender, role: Role){
        this.name = name;
        this.email = email;
        this.password = password;
        this.gender = gender;
        this.role = role;
    }

    @IsNotEmpty()
    @ApiProperty()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    readonly email: string;

    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty()
    readonly password: string;

    @IsNotEmpty()
    @IsEnum(Gender, {
        message: 'gender must be either male or female',
    })
    @ApiProperty()
    readonly gender: Gender;

    @IsNotEmpty()
    @IsEnum(Role, {
        message: 'role must be either vendor or user',
    })
    @ApiProperty()
    readonly role: Role;
}