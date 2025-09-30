import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Seats')
@Controller('seats')
export class SeatsController {
    constructor(private readonly seatsService: SeatsService) { }
    @Post()
    @ApiOperation({ summary: 'Create seat (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createSeatDto: CreateSeatDto) {
        return this.seatsService.create(createSeatDto);
    }
    @Get()
    @ApiOperation({ summary: 'List seats with pagination' })
    @ApiOkResponse({ description: 'List seats with pagination' })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'planeId', required: false })
    findAll(
    @Query()
    page: PaginationDto, 
    @Query('planeId')
    planeId?: string) {
        return this.seatsService.findAll(page, planeId);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get seat by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.seatsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update seat (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateSeatDto: UpdateSeatDto) {
        return this.seatsService.update(id, updateSeatDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete seat (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.seatsService.remove(id);
    }
}
