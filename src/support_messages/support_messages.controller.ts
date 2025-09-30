import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SupportMessagesService } from './support_messages.service';
import { CreateSupportMessageDto } from './dto/create-support_message.dto';
import { UpdateSupportMessageDto } from './dto/update-support_message.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Support Messages')
@Controller('support-messages')
export class SupportMessagesController {
    constructor(private readonly supportMessagesService: SupportMessagesService) { }
    @Post()
    @ApiOperation({ summary: 'Create support message' })
    create(
    @Body()
    createSupportMessageDto: CreateSupportMessageDto) {
        return this.supportMessagesService.create(createSupportMessageDto);
    }
    @Get()
    @ApiOperation({ summary: 'List support messages with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.supportMessagesService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get support message by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.supportMessagesService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update support message' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateSupportMessageDto: UpdateSupportMessageDto) {
        return this.supportMessagesService.update(id, updateSupportMessageDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete support message' })
    remove(
    @Param('id')
    id: string) {
        return this.supportMessagesService.remove(id);
    }
}
