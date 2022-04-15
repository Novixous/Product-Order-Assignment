import { ORDER_REPOSITORY } from "src/core/constants";
import { Order } from "./order.entity";

export const ordersProvider = [{
    provide: ORDER_REPOSITORY,
    useValue: Order,
}];