import { Body, CACHE_MANAGER, Controller, ForbiddenException, Get, Inject, Injectable, NotFoundException, ParseIntPipe, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../users/dto/user.dto';
import { CartsService } from './carts.service';
import { CartDto, CartItem } from './dto/cart.dto';

@Injectable()
@ApiBearerAuth()
@ApiTags('Carts')
@Controller('carts')
export class CartsController {
    constructor(private readonly cartService: CartsService) { }

    @Get()
    @Roles(Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async getCartInfo(@Query('userId', ParseIntPipe) userId: number, @Request() req) {
        if (userId !== req.user.id) {
            throw new ForbiddenException('You can not view someone else cart.');
        }
        return await this.cartService.getCartInfo(userId);
    }

    @Post()
    @Roles(Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async setCartInfo(@Query('userId', ParseIntPipe) userId: number, @Body() cart: CartDto, @Request() req) {
        if (req.user.id !== userId) {
            throw new ForbiddenException('You can not modify other people\'s cart!');
        }
        await this.cartService.setCartInfo(userId, cart);
        return "Saved cart successfully."
    }
}
