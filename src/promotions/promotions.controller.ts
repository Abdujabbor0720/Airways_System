import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) { }
    @Post()
    @ApiOperation({ summary: 'Create promotion' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createPromotionDto: CreatePromotionDto) {
        return this.promotionsService.create(createPromotionDto);
    }
    @Get()
    @ApiOperation({ summary: 'List promotions with pagination' })
    @ApiOkResponse({ description: 'List promotions with pagination' })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    findAll(
    @Query('limit')
    limit = 20, 
    @Query('offset')
    offset = 0) {
        return this.promotionsService.findAll(Number(offset), Math.min(Number(limit) || 20, 100));
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get promotion by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.promotionsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update promotion' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updatePromotionDto: UpdatePromotionDto) {
        return this.promotionsService.update(id, updatePromotionDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete promotion' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.promotionsService.remove(id);
    }
}
