import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TranslationsService } from './translations.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Translations')
@Controller('translations')
export class TranslationsController {
    constructor(private readonly translationsService: TranslationsService) { }
    @Post()
    @ApiOperation({ summary: 'Create translation entry' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    dto: CreateTranslationDto) {
        return this.translationsService.create(dto);
    }
    @Get()
    @ApiOperation({ summary: 'List translations with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.translationsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get translation by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.translationsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update translation' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    dto: UpdateTranslationDto) {
        return this.translationsService.update(id, dto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete translation' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.translationsService.remove(id);
    }
}
