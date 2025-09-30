import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AirlinesService } from './airlines.service';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Airlines')
@Controller('airlines')
export class AirlinesController {
    constructor(private readonly airlinesService: AirlinesService) { }
    @Post()
    @ApiOperation({ summary: 'Create airline' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async create(
    @Body()
    createAirlineDto: CreateAirlineDto) {
        return await this.airlinesService.create(createAirlineDto);
    }
    @Get()
    @ApiOperation({ summary: 'List airlines with pagination' })
    @ApiOkResponse({ description: 'List airlines with pagination' })
    async findAll(
    @Query()
    page: PaginationDto) {
        return await this.airlinesService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get airline by ID' })
    async findOne(
    @Param('id')
    id: string) {
        return await this.airlinesService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update airline' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async update(
    @Param('id')
    id: string, 
    @Body()
    updateAirlineDto: UpdateAirlineDto) {
        return await this.airlinesService.update(id, updateAirlineDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete airline' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async remove(
    @Param('id')
    id: string) {
        return await this.airlinesService.remove(id);
    }
    @Get('lookup/by-code')
    @ApiOperation({ summary: 'Lookup airline by IATA or ICAO code' })
    @ApiQuery({ name: 'iata', required: false })
    @ApiQuery({ name: 'icao', required: false })
    async findByCode(
    @Query('iata')
    iata?: string, 
    @Query('icao')
    icao?: string) {
        if (iata)
            return await this.airlinesService.findByIata(iata);
        if (icao)
            return await this.airlinesService.findByIcao(icao);
        return null;
    }
}
