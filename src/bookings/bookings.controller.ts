import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TicketsService } from '../tickets/tickets.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { BookingHistoryService } from '../booking_history/booking_history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService, private readonly ticketsService: TicketsService, private readonly bookingHistoryService: BookingHistoryService) { }
    @Post()
    @ApiOperation({ summary: 'Create booking (user)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    create(
    @Body()
    createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(createBookingDto);
    }
    @Get()
    @ApiOperation({ summary: 'List bookings with pagination (user)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'List bookings with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.bookingsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get booking by ID (user)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    findOne(
    @Param('id')
    id: string) {
        return this.bookingsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update booking (user)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    update(
    @Param('id')
    id: string, 
    @Body()
    updateBookingDto: UpdateBookingDto) {
        return this.bookingsService.update(id, updateBookingDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete booking (ADMIN/SUPER_ADMIN)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.bookingsService.remove(id);
    }
    @Post(':id/tickets/issue')
    @ApiOperation({ summary: 'Issue tickets for booking (ADMIN/SUPER_ADMIN)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    issueTickets(
    @Param('id')
    id: string) {
        return this.ticketsService.issueForBooking(id);
    }
    @Get(':id/history')
    @ApiOperation({ summary: 'List booking history with pagination (user)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'List booking history with pagination' })
    history(
    @Param('id')
    id: string, 
    @Query()
    page: PaginationDto) {
        return this.bookingHistoryService.findByBooking(id, page);
    }
}
