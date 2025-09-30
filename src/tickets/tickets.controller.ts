import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }
    @Post()
    @ApiOperation({ summary: 'Create ticket' })
    create(
    @Body()
    createTicketDto: CreateTicketDto) {
        return this.ticketsService.create(createTicketDto);
    }
    @Get()
    @ApiOperation({ summary: 'List tickets with pagination' })
    @ApiOkResponse({ description: 'List tickets with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.ticketsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get ticket by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.ticketsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update ticket' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateTicketDto: UpdateTicketDto) {
        return this.ticketsService.update(id, updateTicketDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete ticket' })
    remove(
    @Param('id')
    id: string) {
        return this.ticketsService.remove(id);
    }
}
