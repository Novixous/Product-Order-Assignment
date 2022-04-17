import { ApiProperty } from "@nestjs/swagger"
export enum OrderAttributes {
    ID = 'id',
    PRODUCT = 'products',
    TOTALPRICE = 'totalPrice',
    CUSTOMERADDRESS = 'customerAddress',
    CUSTOMERZIPCODE = 'customerZipcode',
    CUSTOMERCOUNTRY = 'customerCountry',
    USERID = 'userId'
}
export class OrderFilterDto {
    @ApiProperty({
        enum: OrderAttributes,
        isArray: true,
        example: [
            OrderAttributes.ID,
            OrderAttributes.PRODUCT,
            OrderAttributes.TOTALPRICE,
            OrderAttributes.CUSTOMERADDRESS,
            OrderAttributes.CUSTOMERZIPCODE,
            OrderAttributes.CUSTOMERCOUNTRY,
            OrderAttributes.USERID],
    })
    attributes: OrderAttributes[]
    @ApiProperty()
    where: any
}