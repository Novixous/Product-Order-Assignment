import { Body, Controller, Get, Injectable, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CartDto } from '../carts/dto/cart.dto';
import { Role } from '../users/dto/user.dto';
import { OrdersService } from './orders.service';

@Injectable()
@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) { }

    @Get()
    @Roles(Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async findAll(@Request() req) {
        // get all products in the db
        return await this.orderService.findAll(req.user);
    }

    @Post()
    @Roles(Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async createOrders(@Request() req, @Body() cart: CartDto) {
        // get all products in the db
        return await this.orderService.createOrder(cart, req.user.id);
    }
}
