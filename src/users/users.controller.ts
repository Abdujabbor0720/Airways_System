import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SelfOrAdminGuard } from '../auth/guards/self-or-admin.guard';
@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Post()
    @ApiOperation({ summary: 'Create user (admin only)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
    @Get()
    @ApiOperation({ summary: 'List users with pagination (admin only)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiOkResponse({ description: 'List users with pagination' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findAll(
    @Query('page')
    page = 1, 
    @Query('limit')
    limit = 20) {
        const take = Math.min(Number(limit) || 20, 100);
        const skip = ((Number(page) || 1) - 1) * take;
        return this.usersService.findAll(skip, take);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID (self or admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
    findOne(
    @Param('id')
    id: string) {
        return this.usersService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update user (self or admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
    update(
    @Param('id')
    id: string, 
    @Body()
    updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete user (self or admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
    remove(
    @Param('id')
    id: string) {
        return this.usersService.remove(id);
    }
}
