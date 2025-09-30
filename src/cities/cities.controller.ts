import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
    constructor(private readonly citiesService: CitiesService) { }
    @Post()
    @ApiOperation({ summary: 'Create city' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createCityDto: CreateCityDto) {
        return this.citiesService.create(createCityDto);
    }
    @Get()
    @ApiOperation({ summary: 'List cities with pagination' })
    @ApiOkResponse({ description: 'List cities with pagination' })
    @ApiQuery({ name: 'countryId', required: false })
    findAll(
    @Query()
    page: PaginationDto, 
    @Query('countryId')
    countryId?: string) {
        return this.citiesService.findAll(page, countryId);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get city by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.citiesService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update city' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateCityDto: UpdateCityDto) {
        return this.citiesService.update(id, updateCityDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete city' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.citiesService.remove(id);
    }
}
