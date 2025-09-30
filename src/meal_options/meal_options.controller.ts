import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MealOptionsService } from './meal_options.service';
import { CreateMealOptionDto } from './dto/create-meal_option.dto';
import { UpdateMealOptionDto } from './dto/update-meal_option.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Meal Options')
@Controller('meal-options')
export class MealOptionsController {
    constructor(private readonly mealOptionsService: MealOptionsService) { }
    @Post()
    @ApiOperation({ summary: 'Create meal option' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createMealOptionDto: CreateMealOptionDto) {
        return this.mealOptionsService.create(createMealOptionDto);
    }
    @Get()
    @ApiOperation({ summary: 'List meal options with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.mealOptionsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get meal option by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.mealOptionsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update meal option' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateMealOptionDto: UpdateMealOptionDto) {
        return this.mealOptionsService.update(id, updateMealOptionDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete meal option' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.mealOptionsService.remove(id);
    }
}
