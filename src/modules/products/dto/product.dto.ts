import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Min} from "class-validator";

export class ProductDto {

    constructor(name: string, price: number, quantity: number, description: string, isDeleted: boolean){
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.isDeleted = isDeleted;
    }

    @ApiProperty()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Min(0)
    readonly price: number;
   
    @ApiProperty()
    @Min(0)
    @IsNotEmpty()
    readonly quantity: number;
    
    @ApiProperty()
    readonly description: string;

    @ApiProperty()
    readonly isDeleted: boolean;
}