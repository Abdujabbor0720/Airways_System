import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Partners')
@Controller('partners')
export class PartnersController {
    constructor(private readonly partnersService: PartnersService) { }
    @Post()
    @ApiOperation({ summary: 'Create partner' })
    create(
    @Body()
    createPartnerDto: CreatePartnerDto) {
        return this.partnersService.create(createPartnerDto);
    }
    @Get()
    @ApiOperation({ summary: 'List partners with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.partnersService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get partner by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.partnersService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update partner' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updatePartnerDto: UpdatePartnerDto) {
        return this.partnersService.update(id, updatePartnerDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete partner' })
    remove(
    @Param('id')
    id: string) {
        return this.partnersService.remove(id);
    }
}
