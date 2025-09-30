import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingHistoryService } from './booking_history.service';
import { CreateBookingHistoryDto } from './dto/create-booking_history.dto';
import { UpdateBookingHistoryDto } from './dto/update-booking_history.dto';
import { NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Booking History')
@Controller('booking-history')
export class BookingHistoryController {
    constructor(private readonly bookingHistoryService: BookingHistoryService) { }
    @Post()
    @ApiOperation({ summary: 'Create booking history entry' })
    create(
    @Body()
    createBookingHistoryDto: CreateBookingHistoryDto) {
        return this.bookingHistoryService.create(createBookingHistoryDto);
    }
    @Get()
    @ApiOperation({ summary: 'List booking history with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.bookingHistoryService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get booking history by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.bookingHistoryService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update booking history (not allowed)' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateBookingHistoryDto: UpdateBookingHistoryDto) {
        throw new NotFoundException('Booking history is immutable and cannot be updated');
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete booking history (not allowed)' })
    remove(
    @Param('id')
    id: string) {
        throw new NotFoundException('Booking history is immutable and cannot be removed');
    }
}
