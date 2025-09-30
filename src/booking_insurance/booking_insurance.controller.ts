import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingInsuranceService } from './booking_insurance.service';
import { CreateBookingInsuranceDto } from './dto/create-booking_insurance.dto';
import { UpdateBookingInsuranceDto } from './dto/update-booking_insurance.dto';
@ApiTags('Booking Insurance')
@Controller('booking-insurance')
export class BookingInsuranceController {
    constructor(private readonly bookingInsuranceService: BookingInsuranceService) { }
    @Post()
    @ApiOperation({ summary: 'Create booking insurance' })
    async create(
    @Body()
    createBookingInsuranceDto: CreateBookingInsuranceDto) {
        return await this.bookingInsuranceService.create(createBookingInsuranceDto);
    }
    @Get()
    @ApiOperation({ summary: 'List booking insurance records' })
    async findAll() {
        return await this.bookingInsuranceService.findAll();
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get booking insurance by ID' })
    async findOne(
    @Param('id')
    id: string) {
        return await this.bookingInsuranceService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update booking insurance' })
    async update(
    @Param('id')
    id: string, 
    @Body()
    updateBookingInsuranceDto: UpdateBookingInsuranceDto) {
        return await this.bookingInsuranceService.update(id, updateBookingInsuranceDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete booking insurance' })
    async remove(
    @Param('id')
    id: string) {
        return await this.bookingInsuranceService.remove(id);
    }
}
