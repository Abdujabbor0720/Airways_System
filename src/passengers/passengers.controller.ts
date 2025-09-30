import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PassengersService } from './passengers.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Passengers')
@Controller('passengers')
export class PassengersController {
    constructor(private readonly passengersService: PassengersService) { }
    @Post()
    @ApiOperation({ summary: 'Create passenger' })
    create(
    @Body()
    createPassengerDto: CreatePassengerDto) {
        return this.passengersService.create(createPassengerDto);
    }
    @Get()
    @ApiOperation({ summary: 'List passengers with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.passengersService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get passenger by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.passengersService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update passenger' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updatePassengerDto: UpdatePassengerDto) {
        return this.passengersService.update(id, updatePassengerDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete passenger' })
    remove(
    @Param('id')
    id: string) {
        return this.passengersService.remove(id);
    }
}
