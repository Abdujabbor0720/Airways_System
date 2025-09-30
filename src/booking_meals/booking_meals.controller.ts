import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingMealsService } from './booking_meals.service';
import { CreateBookingMealDto } from './dto/create-booking_meal.dto';
import { UpdateBookingMealDto } from './dto/update-booking_meal.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@ApiTags('Booking Meals')
@Controller('booking-meals')
export class BookingMealsController {
    constructor(private readonly bookingMealsService: BookingMealsService) { }
    @Post()
    @ApiOperation({ summary: 'Add meal to booking' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    create(
    @Body()
    createBookingMealDto: CreateBookingMealDto) {
        return this.bookingMealsService.create(createBookingMealDto);
    }
    @Get()
    @ApiOperation({ summary: 'List booking meals with pagination' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    findAll(
    @Query()
    page: PaginationDto) {
        return this.bookingMealsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get booking meal by ID' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    findOne(
    @Param('id')
    id: string) {
        return this.bookingMealsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update booking meal' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    update(
    @Param('id')
    id: string, 
    @Body()
    updateBookingMealDto: UpdateBookingMealDto) {
        return this.bookingMealsService.update(id, updateBookingMealDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Remove booking meal' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    remove(
    @Param('id')
    id: string) {
        return this.bookingMealsService.remove(id);
    }
}
