import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../core/constants';
import { Role } from '../users/dto/user.dto';
import { User } from '../users/user.entity';
import { ProductDto } from './dto/product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
    constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepository: typeof Product) { }

    async findAll(userId: number, role: Role): Promise<Product[]> {
        let where = {};
        switch (role) {
            case Role.USER:
                where = { isDeleted: false }
                break;
            case Role.VENDOR:
                where = { vendorUserId: userId }
                break;
        }
        return await this.productRepository.findAll<Product>({
            include: [{ model: User, attributes: { exclude: ['password'] } }],
            where
        });

    }

    async findOne(id: number, userId: number, role: Role): Promise<Product> {
        let where = {};
        switch (role) {
            case Role.USER:
                where = { isDeleted: false }
                break;
            case Role.VENDOR:
                where = { vendorUserId: userId }
                break;
        }
        return await this.productRepository.findOne({
        	where: { ...where, id },
        	include: [{ model: User, attributes: { exclude: ['password'] } }],
    	});
    }

    async create(product: ProductDto, vendorUserId): Promise<Product> {
        return await this.productRepository.create<Product>({ ...product, vendorUserId });
    }

    async update(id, data, userId) {
        const [numberOfAffectedRows, [updatedProduct]] = await this.productRepository.update({ ...data }, { where: { id, vendorUserId: userId }, returning: true });

        return { numberOfAffectedRows, updatedProduct };
    }

    async delete(id, vendorId) {
        const [numberOfAffectedRows, [deletedProduct]] = await this.productRepository.update({ isDeleted: true }, { where: { id, vendorUserId: vendorId }, returning: true });     
        return { numberOfAffectedRows, deletedProduct };

    }
}
