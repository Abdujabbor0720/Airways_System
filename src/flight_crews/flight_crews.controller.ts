import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FlightCrewsService } from './flight_crews.service';
import { CreateFlightCrewDto } from './dto/create-flight_crew.dto';
import { UpdateFlightCrewDto } from './dto/update-flight_crew.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Flight Crews')
@Controller('flight-crews')
export class FlightCrewsController {
    constructor(private readonly flightCrewsService: FlightCrewsService) { }
    @Post()
    @ApiOperation({ summary: 'Create flight crew (assign members to flight)' })
    create(
    @Body()
    createFlightCrewDto: CreateFlightCrewDto) {
        return this.flightCrewsService.create(createFlightCrewDto);
    }
    @Get()
    @ApiOperation({ summary: 'List flight crews with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.flightCrewsService.findAll(page.offset, page.limit);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get flight crew by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.flightCrewsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update flight crew' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateFlightCrewDto: UpdateFlightCrewDto) {
        return this.flightCrewsService.update(id, updateFlightCrewDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete flight crew' })
    remove(
    @Param('id')
    id: string) {
        return this.flightCrewsService.remove(id);
    }
}
