import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }
    @Post()
    @ApiOperation({ summary: 'Create notification (enqueue sending)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createNotificationDto: CreateNotificationDto) {
        return this.notificationsService.create(createNotificationDto);
    }
    @Get()
    @ApiOperation({ summary: 'List notifications with pagination' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'List notifications with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.notificationsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get notification by ID' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    findOne(
    @Param('id')
    id: string) {
        return this.notificationsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update notification (only QUEUED)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateNotificationDto: UpdateNotificationDto) {
        return this.notificationsService.update(id, updateNotificationDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete notification (only QUEUED)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.notificationsService.remove(id);
    }
    @Post('worker/process-next')
    @ApiOperation({ summary: 'Process next notification in queue (worker)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    processNext() {
        return this.notificationsService.processNext();
    }
}
