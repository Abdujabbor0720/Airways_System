import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Geo: Airports')
@Controller('airports')
export class AirportsController {
    constructor(private readonly airportsService: AirportsService) { }
    @Post()
    @ApiOperation({ summary: 'Create airport' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async create(
    @Body()
    createAirportDto: CreateAirportDto) {
        return await this.airportsService.create(createAirportDto);
    }
    @Get()
    @ApiOperation({ summary: 'List airports with pagination' })
    @ApiOkResponse({ description: 'List airports with pagination' })
    @ApiQuery({ name: 'cityId', required: false })
    async findAll(
    @Query()
    page: PaginationDto, 
    @Query('cityId')
    cityId?: string) {
        return await this.airportsService.findAll(page, cityId);
    }
    @Get('search/by-code')
    @ApiOperation({ summary: 'Find airport by IATA/ICAO code' })
    @ApiQuery({ name: 'iata', required: false })
    @ApiQuery({ name: 'icao', required: false })
    async searchByCode(
    @Query('iata')
    iata?: string, 
    @Query('icao')
    icao?: string) {
        return await this.airportsService.search(iata, icao);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get airport by ID' })
    async findOne(
    @Param('id')
    id: string) {
        return await this.airportsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update airport' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async update(
    @Param('id')
    id: string, 
    @Body()
    updateAirportDto: UpdateAirportDto) {
        return await this.airportsService.update(id, updateAirportDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete airport' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async remove(
    @Param('id')
    id: string) {
        return await this.airportsService.remove(id);
    }
}
