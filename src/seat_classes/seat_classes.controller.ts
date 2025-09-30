import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SeatClassesService } from './seat_classes.service';
import { CreateSeatClassDto } from './dto/create-seat_class.dto';
import { UpdateSeatClassDto } from './dto/update-seat_class.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Seat Classes')
@Controller('seat-classes')
export class SeatClassesController {
    constructor(private readonly seatClassesService: SeatClassesService) { }
    @Post()
    @ApiOperation({ summary: 'Create seat class' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createSeatClassDto: CreateSeatClassDto) {
        return this.seatClassesService.create(createSeatClassDto);
    }
    @Get()
    @ApiOperation({ summary: 'List seat classes with pagination' })
    @ApiOkResponse({ description: 'List seat classes with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.seatClassesService.findAll(Number(page.offset ?? 0), Math.min(Number(page.limit ?? 20) || 20, 100));
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get seat class by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.seatClassesService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update seat class' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateSeatClassDto: UpdateSeatClassDto) {
        return this.seatClassesService.update(id, updateSeatClassDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete seat class' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.seatClassesService.remove(id);
    }
}
