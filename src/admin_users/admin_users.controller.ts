import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AdminUsersService } from './admin_users.service';
import { CreateAdminUserDto } from './dto/create-admin_user.dto';
import { UpdateAdminUserDto } from './dto/update-admin_user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Admin Users')
@Controller('admin-users')
export class AdminUsersController {
    constructor(private readonly adminUsersService: AdminUsersService) { }
    @Post()
    @ApiOperation({ summary: 'Create admin user (SUPER_ADMIN only)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPER_ADMIN')
    async create(
    @Body()
    createAdminUserDto: CreateAdminUserDto, 
    @Req()
    req: any) {
        return await this.adminUsersService.create(createAdminUserDto);
    }
    @Get()
    @ApiOperation({ summary: 'List admin users (ADMIN or SUPER_ADMIN)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async findAll() {
        return await this.adminUsersService.findAll();
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get admin user by ID' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async findOne(
    @Param('id')
    id: string) {
        return await this.adminUsersService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update admin user (self or SUPER_ADMIN)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    async update(
    @Param('id')
    id: string, 
    @Body()
    updateAdminUserDto: UpdateAdminUserDto, 
    @Req()
    req: any) {
        return await this.adminUsersService.update(id, updateAdminUserDto, req.user);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete admin user (SUPER_ADMIN only)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPER_ADMIN')
    async remove(
    @Param('id')
    id: string, 
    @Req()
    req: any) {
        return await this.adminUsersService.remove(id, req.user);
    }
}
