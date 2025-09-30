import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FareClassesService } from './fare_classes.service';
import { CreateFareClassDto } from './dto/create-fare_class.dto';
import { UpdateFareClassDto } from './dto/update-fare_class.dto';
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Fare Classes')
@Controller('fare-classes')
export class FareClassesController {
    constructor(private readonly fareClassesService: FareClassesService) { }
    @Post()
    @ApiOperation({ summary: 'Create fare class' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createFareClassDto: CreateFareClassDto) {
        return this.fareClassesService.create(createFareClassDto);
    }
    @Get()
    @ApiOperation({ summary: 'List fare classes with pagination' })
    @ApiOkResponse({ description: 'List fare classes with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.fareClassesService.findAll(Number(page.offset ?? 0), Math.min(Number(page.limit ?? 20) || 20, 100));
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get fare class by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.fareClassesService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update fare class' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateFareClassDto: UpdateFareClassDto) {
        return this.fareClassesService.update(id, updateFareClassDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete fare class' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.fareClassesService.remove(id);
    }
}
