import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SupportTicketsService } from './support_tickets.service';
import { CreateSupportTicketDto } from './dto/create-support_ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support_ticket.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Support Tickets')
@Controller('support-tickets')
export class SupportTicketsController {
    constructor(private readonly supportTicketsService: SupportTicketsService) { }
    @Post()
    @ApiOperation({ summary: 'Create support ticket' })
    create(
    @Body()
    createSupportTicketDto: CreateSupportTicketDto) {
        return this.supportTicketsService.create(createSupportTicketDto);
    }
    @Get()
    @ApiOperation({ summary: 'List support tickets with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.supportTicketsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get support ticket by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.supportTicketsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update support ticket' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateSupportTicketDto: UpdateSupportTicketDto) {
        return this.supportTicketsService.update(id, updateSupportTicketDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete support ticket' })
    remove(
    @Param('id')
    id: string) {
        return this.supportTicketsService.remove(id);
    }
}
