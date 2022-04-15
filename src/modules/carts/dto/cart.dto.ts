import { ApiProperty } from "@nestjs/swagger";

export class CartItem {

    constructor(productId: number, quantity: number) {
        this.productId = productId;
        this.quantity = quantity;
    }
    @ApiProperty()
    productId: number;
    @ApiProperty()
    quantity: number;
}

export class CartDto {

    constructor(userId: number, cartItems: CartItem[], totalPrice: number) {
        this.userId = userId;
        this.cartItems = cartItems;
        this.totalPrice = totalPrice;
    }
    @ApiProperty()
    userId: number;
    @ApiProperty({ type: [CartItem] })
    cartItems: CartItem[];
    totalPrice: number;
}