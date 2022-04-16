import { Body, Controller, Get, Injectable, Param, Post, Request, Response, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response as ExpRes, response } from 'express';
import { Transaction } from 'sequelize';
import { TransactionParam } from 'src/core/database/transaction-param.decorator';
import { TransactionInterceptor } from 'src/core/database/transaction.interceptor';
import { Readable } from 'stream';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../users/dto/user.dto';
import { OrderDetailDto } from './dto/order_detail.dto';
import { OrderFilterDto } from './dto/order_filter.dto';
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
    @UseInterceptors(TransactionInterceptor)
    async createOrders(@Request() req, @Body() orderDetail: OrderDetailDto, @TransactionParam() transaction: Transaction) {
        // get all products in the db
        return await this.orderService.createOrder(orderDetail, req.user.id, transaction);
    }

    @Get(':orderId/receipt')
    @Roles(Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async getReceiptPDF(@Param('orderId') orderId: number, @Request() req, @Response() response: ExpRes) {
        const buffer = await this.orderService.getRecepitPDF(req.user, orderId);
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        response.set({
            // pdf
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=recepit.pdf',
            'Content-Length': buffer.length,

            // prevent cache
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0,
        });
        stream.pipe(response);

    }

    @Post('/csv')
    @Roles(Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async getCSV(@Request() req, @Body() orderFilter: OrderFilterDto, @Response() response: ExpRes) {
        const csv = await this.orderService.getCSV(orderFilter, req.user.id);
        response.set({
            'Content-Disposition': 'attachment; filename=orders.csv',
            // prevent cache
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0,
        })
        response.status(200).send(csv);
    }
}
