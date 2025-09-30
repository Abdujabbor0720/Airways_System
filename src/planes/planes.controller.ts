import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PlanesService } from './planes.service';
import { CreatePlaneDto } from './dto/create-plane.dto';
import { UpdatePlaneDto } from './dto/update-plane.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Planes')
@Controller('planes')
export class PlanesController {
    constructor(private readonly planesService: PlanesService) { }
    @Post()
    @ApiOperation({ summary: 'Create plane' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createPlaneDto: CreatePlaneDto) {
        return this.planesService.create(createPlaneDto);
    }
    @Get()
    @ApiOperation({ summary: 'List planes with pagination' })
    @ApiOkResponse({ description: 'List planes with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.planesService.findAll(Number(page.offset ?? 0), Math.min(Number(page.limit ?? 20) || 20, 100));
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get plane by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.planesService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update plane' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updatePlaneDto: UpdatePlaneDto) {
        return this.planesService.update(id, updatePlaneDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete plane' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.planesService.remove(id);
    }
}
