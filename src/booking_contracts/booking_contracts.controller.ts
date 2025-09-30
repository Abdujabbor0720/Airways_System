import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingContractsService } from './booking_contracts.service';
import { CreateBookingContractDto } from './dto/create-booking_contract.dto';
import { UpdateBookingContractDto } from './dto/update-booking_contract.dto';
import { ConflictException } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Booking Contracts')
@Controller('booking-contracts')
export class BookingContractsController {
    constructor(private readonly bookingContractsService: BookingContractsService) { }
    @Post()
    @ApiOperation({ summary: 'Create booking contract (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createBookingContractDto: CreateBookingContractDto) {
        return this.bookingContractsService.create(createBookingContractDto);
    }
    @Get()
    @ApiOperation({ summary: 'List booking contracts with pagination (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    findAll(
    @Query()
    page: PaginationDto) {
        return this.bookingContractsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get booking contract by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.bookingContractsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update booking contract (not allowed)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateBookingContractDto: UpdateBookingContractDto) {
        throw new ConflictException('Booking contracts are immutable and cannot be updated');
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete booking contract (not allowed)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        throw new ConflictException('Booking contracts are immutable and cannot be removed');
    }
}
