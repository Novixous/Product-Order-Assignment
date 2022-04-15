import { PRODUCT_REPOSITORY } from "src/core/constants";
import { Product } from "./product.entity";

export const productsProvider = [{
    provide: PRODUCT_REPOSITORY,
    useValue: Product
}]