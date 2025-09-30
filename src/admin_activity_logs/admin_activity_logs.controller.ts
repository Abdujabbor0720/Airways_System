import { Controller, Get, Post, Body, Param, Query, UseGuards, ForbiddenException, Delete, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminActivityLogsService } from './admin_activity_logs.service';
import { CreateAdminActivityLogDto } from './dto/create-admin_activity_log.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Admin Activity Logs')
@Controller('admin-activity-logs')
export class AdminActivityLogsController {
    constructor(private readonly adminActivityLogsService: AdminActivityLogsService) { }
    @Post()
    @ApiOperation({ summary: 'Create admin activity log (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async create(
    @Body()
    createAdminActivityLogDto: CreateAdminActivityLogDto) {
        return await this.adminActivityLogsService.create(createAdminActivityLogDto);
    }
    @Get()
    @ApiOperation({ summary: 'List admin activity logs with pagination (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async findAll(
    @Query()
    page: PaginationDto) {
        return await this.adminActivityLogsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get admin activity log by ID (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async findOne(
    @Param('id')
    id: string) {
        return await this.adminActivityLogsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update admin activity log (not allowed)' })
    update() {
        throw new ForbiddenException('Activity logs are immutable and cannot be updated');
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete admin activity log (not allowed)' })
    remove() {
        throw new ForbiddenException('Activity logs are immutable and cannot be deleted');
    }
}
