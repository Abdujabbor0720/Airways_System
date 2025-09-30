import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AirplaneModelsService } from './airplane_models.service';
import { CreateAirplaneModelDto } from './dto/create-airplane_model.dto';
import { UpdateAirplaneModelDto } from './dto/update-airplane_model.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Airplane Models')
@Controller('airplane-models')
export class AirplaneModelsController {
    constructor(private readonly airplaneModelsService: AirplaneModelsService) { }
    @Post()
    @ApiOperation({ summary: 'Create airplane model' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async create(
    @Body()
    createAirplaneModelDto: CreateAirplaneModelDto) {
        return await this.airplaneModelsService.create(createAirplaneModelDto);
    }
    @Get()
    @ApiOperation({ summary: 'List airplane models with pagination' })
    @ApiOkResponse({ description: 'List airplane models with pagination' })
    async findAll(
    @Query()
    page: PaginationDto) {
        return await this.airplaneModelsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get airplane model by ID' })
    async findOne(
    @Param('id')
    id: string) {
        return await this.airplaneModelsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update airplane model' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async update(
    @Param('id')
    id: string, 
    @Body()
    updateAirplaneModelDto: UpdateAirplaneModelDto) {
        return await this.airplaneModelsService.update(id, updateAirplaneModelDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete airplane model' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async remove(
    @Param('id')
    id: string) {
        return await this.airplaneModelsService.remove(id);
    }
}
