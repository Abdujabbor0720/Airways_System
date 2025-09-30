import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TicketsCouponsService } from './tickets_coupons.service';
import { CreateTicketsCouponDto } from './dto/create-tickets_coupon.dto';
import { UpdateTicketsCouponDto } from './dto/update-tickets_coupon.dto';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Ticket Coupons')
@Controller('tickets-coupons')
export class TicketsCouponsController {
    constructor(private readonly ticketsCouponsService: TicketsCouponsService) { }
    @Post()
    @ApiOperation({ summary: 'Create ticket coupon' })
    create(
    @Body()
    createTicketsCouponDto: CreateTicketsCouponDto) {
        return this.ticketsCouponsService.create(createTicketsCouponDto);
    }
    @Get()
    @ApiOperation({ summary: 'List ticket coupons with pagination' })
    @ApiOkResponse({ description: 'List ticket coupons with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.ticketsCouponsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get ticket coupon by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.ticketsCouponsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update ticket coupon' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateTicketsCouponDto: UpdateTicketsCouponDto) {
        return this.ticketsCouponsService.update(id, updateTicketsCouponDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete ticket coupon' })
    remove(
    @Param('id')
    id: string) {
        return this.ticketsCouponsService.remove(id);
    }
}
