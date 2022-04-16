import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/user.entity";
import { OrderProductDto } from "./dto/order_product.dto";

@Table
export class Order extends Model<Order> {

    @Column({
        type: DataType.JSONB,
        allowNull: false,
    })
    products: OrderProductDto[];

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
    })
    totalPrice: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    customerAddress: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    customerZipcode: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    customerCountry: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @BelongsTo(() => User)
    user: User;
}