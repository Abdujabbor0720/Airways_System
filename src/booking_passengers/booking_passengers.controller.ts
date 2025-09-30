import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingPassengersService } from './booking_passengers.service';
import { CreateBookingPassengerDto } from './dto/create-booking_passenger.dto';
import { UpdateBookingPassengerDto } from './dto/update-booking_passenger.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Booking Passengers')
@Controller('booking-passengers')
export class BookingPassengersController {
    constructor(private readonly bookingPassengersService: BookingPassengersService) { }
    @Post()
    @ApiOperation({ summary: 'Add passenger to booking' })
    create(
    @Body()
    createBookingPassengerDto: CreateBookingPassengerDto) {
        return this.bookingPassengersService.create(createBookingPassengerDto);
    }
    @Get()
    @ApiOperation({ summary: 'List booking passengers with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.bookingPassengersService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get booking passenger by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.bookingPassengersService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update booking passenger' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateBookingPassengerDto: UpdateBookingPassengerDto) {
        return this.bookingPassengersService.update(id, updateBookingPassengerDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Remove booking passenger' })
    remove(
    @Param('id')
    id: string) {
        return this.bookingPassengersService.remove(id);
    }
}
