import { PRODUCT_REPOSITORY } from "../../core/constants";
import { Product } from "./product.entity";

export const productsProvider = [{
    provide: PRODUCT_REPOSITORY,
    useValue: Product
}]