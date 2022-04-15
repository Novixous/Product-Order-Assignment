import { Controller, Get, Request, UseGuards, Post, Body, Param, NotFoundException, Delete, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role, UserDto } from '../users/dto/user.dto';
import { ProductDto } from './dto/product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }

    @Get()
    @Roles(Role.USER, Role.VENDOR)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async findAll(@Request() req) {
        // get all products in the db
        return await this.productService.findAll(req.user);
    }

    @Get(':id')
    @Roles(Role.USER, Role.VENDOR)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async findOne(@Param('id') id: number, @Request() req): Promise<Product> {
        // find the product with this id
        const post = await this.productService.findOne(id, req.user);

        // if the post doesn't exit in the db, throw a 404 error
        if (!post) {
            throw new NotFoundException('This product doesn\'t exist or you have no permission to view');
        }

        // if product exist, return the product
        return post;
    }

    @Post()
    @Roles(Role.VENDOR)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async create(@Body() post: ProductDto, @Request() req): Promise<Product> {
        // create a new product and return the newly created product
        return await this.productService.create(post, req.user.id);
    }

    @Put(':id')
    @Roles(Role.VENDOR)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async update(@Param('id') id: number, @Body() post: ProductDto, @Request() req): Promise<ProductDto> {
        const { numberOfAffectedRows, updatedProduct } = await this.productService.update(id, post, req.user.id);

        if (numberOfAffectedRows === 0) {
            throw new NotFoundException('This Product doesn\'t exist or you don\'t have permission to edit this product.');
        }

        return updatedProduct;
    }

    @Delete(':id')
    @Roles(Role.VENDOR)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async remove(@Param('id') id: number, @Request() req) {
        const { numberOfAffectedRows, deletedProduct } = await this.productService.delete(id, req.user.id);
        if (numberOfAffectedRows === 0) {
            throw new NotFoundException('This Product doesn\'t exist or you don\'t have permission to delete this product.');
        }
        return deletedProduct;
    }

    
}
