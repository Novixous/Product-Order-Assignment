
export class OrderProductDto {
    constructor(productId: number, name: string, price: number, quantity: number, totalPrice: number) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }
    readonly productId: number;
    readonly name: string;
    readonly price: number;
    readonly quantity: number;
    readonly totalPrice: number;
}