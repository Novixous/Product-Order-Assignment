import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/user.entity";
import { OrderProduct } from "./dto/order_product.dto";

@Table
export class Order extends Model<Order> {

    @Column({
        type: DataType.JSONB,
        allowNull: false,
    })
    products: OrderProduct[];

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
    })
    totalPrice: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @BelongsTo(() => User)
    user: User;
}