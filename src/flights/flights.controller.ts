import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import type { Request } from 'express';
import { FlightInstancesService } from '../flight_instances/flight_instances.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Flights')
@Controller('flights')
export class FlightsController {
    constructor(private readonly flightsService: FlightsService, private readonly flightInstancesService: FlightInstancesService) { }
    @Post()
    @ApiOperation({ summary: 'Create a new flight' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createFlightDto: CreateFlightDto) {
        return this.flightsService.create(createFlightDto);
    }
    @Get()
    @ApiOperation({ summary: 'List flights with pagination' })
    @ApiOkResponse({ description: 'List flights with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.flightsService.findAll(page);
    }
    @Get('search')
    @ApiOperation({ summary: 'Public search for flight instances by route and date' })
    @ApiOkResponse({ description: 'Search flight instances by route/date' })
    @ApiQuery({ name: 'from', required: true })
    @ApiQuery({ name: 'to', required: true })
    @ApiQuery({ name: 'date', required: true, description: 'YYYY-MM-DD' })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'adults', required: false })
    @ApiQuery({ name: 'children', required: false })
    @ApiQuery({ name: 'infants', required: false })
    @ApiQuery({ name: 'cabinClassId', required: false })
    search(
    @Query('from')
    from: string, 
    @Query('to')
    to: string, 
    @Query('date')
    date: string, 
    @Query('limit')
    limit = 20, 
    @Query('offset')
    offset = 0, 
    @Query('adults')
    adults?: number, 
    @Query('children')
    children?: number, 
    @Query('infants')
    infants?: number, 
    @Query('cabinClassId')
    cabinClassId?: string, 
    @Req()
    req?: Request) {
        if (!from || !to || !date) {
            throw new (require('@nestjs/common').BadRequestException)('Missing required query params: from, to, date');
        }
        type AuthUser = {
            sub?: string;
        };
        const user = req && 'user' in req ? (req.user as AuthUser) : undefined;
        const userId = user?.sub as string | undefined;
        return this.flightsService.search({
            from,
            to,
            date,
            limit: Number(limit),
            offset: Number(offset),
            userId,
            adults: adults ? Number(adults) : undefined,
            children: children ? Number(children) : undefined,
            infants: infants ? Number(infants) : undefined,
            cabinClassId,
        });
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get flight by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.flightsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update a flight' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateFlightDto: UpdateFlightDto) {
        return this.flightsService.update(id, updateFlightDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a flight' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.flightsService.remove(id);
    }
    @Get(':id/instances')
    @ApiOperation({ summary: 'List flight instances for a flight' })
    @ApiQuery({ name: 'fromDate', required: false })
    @ApiQuery({ name: 'toDate', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    listInstances(
    @Param('id')
    id: string, 
    @Query('fromDate')
    fromDate?: string, 
    @Query('toDate')
    toDate?: string, 
    @Query('limit')
    limit = 20, 
    @Query('offset')
    offset = 0) {
        return this.flightInstancesService.listByFlightId(id, {
            fromDate,
            toDate,
            limit: Number(limit),
            offset: Number(offset),
        });
    }
}
