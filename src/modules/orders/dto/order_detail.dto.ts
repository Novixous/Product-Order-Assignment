import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNotEmptyObject } from "class-validator";
import { CartDto } from "../../carts/dto/cart.dto";

export class OrderDetailDto {
    @ApiProperty({ type: CartDto })
    @IsNotEmptyObject()
    cart: CartDto;
    @ApiProperty()
    @IsNotEmpty()
    customerAddress: string;
    @ApiProperty()
    @IsNotEmpty()
    customerZipcode: number;
    @ApiProperty()
    @IsNotEmpty()
    customerCountry: string;
}