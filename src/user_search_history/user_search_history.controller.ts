import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserSearchHistoryService } from './user_search_history.service';
import { CreateUserSearchHistoryDto } from './dto/create-user_search_history.dto';
import { UpdateUserSearchHistoryDto } from './dto/update-user_search_history.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('User Search History')
@Controller('user-search-history')
export class UserSearchHistoryController {
    constructor(private readonly userSearchHistoryService: UserSearchHistoryService) { }
    @Post()
    @ApiOperation({ summary: 'Create search history entry' })
    create(
    @Body()
    createUserSearchHistoryDto: CreateUserSearchHistoryDto) {
        return this.userSearchHistoryService.create(createUserSearchHistoryDto);
    }
    @Get()
    @ApiOperation({ summary: 'List user search history with pagination' })
    findAll(
    @Query()
    page: PaginationDto, 
    @Query('userId')
    userId?: string) {
        return this.userSearchHistoryService.findAll(page, userId);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get search history entry by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.userSearchHistoryService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update search history entry' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateUserSearchHistoryDto: UpdateUserSearchHistoryDto) {
        return this.userSearchHistoryService.update(id, updateUserSearchHistoryDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete search history entry' })
    remove(
    @Param('id')
    id: string) {
        return this.userSearchHistoryService.remove(id);
    }
}
