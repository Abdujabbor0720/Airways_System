import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Geo: Countries')
@Controller('countries')
export class CountriesController {
    constructor(private readonly countriesService: CountriesService) { }
    @Post()
    @ApiOperation({ summary: 'Create country' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createCountryDto: CreateCountryDto) {
        return this.countriesService.create(createCountryDto);
    }
    @Get()
    @ApiOperation({ summary: 'List countries with pagination' })
    @ApiOkResponse({ description: 'List countries with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.countriesService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get country by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.countriesService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update country' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateCountryDto: UpdateCountryDto) {
        return this.countriesService.update(id, updateCountryDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete country' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.countriesService.remove(id);
    }
}
