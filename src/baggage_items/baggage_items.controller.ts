import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BaggageItemsService } from './baggage_items.service';
import { CreateBaggageItemDto } from './dto/create-baggage_item.dto';
import { UpdateBaggageItemDto } from './dto/update-baggage_item.dto';
import { BadRequestException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Baggage Items')
@Controller('baggage-items')
export class BaggageItemsController {
    constructor(private readonly baggageItemsService: BaggageItemsService) { }
    @Post()
    @ApiOperation({ summary: 'Create baggage item' })
    create(
    @Body()
    createBaggageItemDto: CreateBaggageItemDto) {
        return this.baggageItemsService.create(createBaggageItemDto);
    }
    @Get()
    @ApiOperation({ summary: 'List baggage items with pagination' })
    @ApiOkResponse({ description: 'List baggage items with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.baggageItemsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get baggage item by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.baggageItemsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update baggage item (not allowed)' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateBaggageItemDto: UpdateBaggageItemDto) {
        throw new BadRequestException('Baggage items are immutable and cannot be updated');
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete baggage item (not allowed)' })
    remove(
    @Param('id')
    id: string) {
        throw new BadRequestException('Baggage items are immutable and cannot be removed');
    }
}
