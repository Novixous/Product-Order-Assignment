import { Table, Column, Model, DataType, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import { User } from '../users/user.entity';

@Table
export class Product extends Model<Product> {

    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
    })
    price: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    quantity: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    description: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    isDeleted: boolean;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    vendorUserId: number;

    @BelongsTo(() => User)
    vendor: User;

}