import { ApiProperty } from "@nestjs/swagger"

export class OrderFilterDto {
    @ApiProperty()
    attributes: string[]
    @ApiProperty()
    where: any
}