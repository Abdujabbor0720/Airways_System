import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoyaltyAccountsService } from './loyalty_accounts.service';
import { CreateLoyaltyAccountDto } from './dto/create-loyalty_account.dto';
import { UpdateLoyaltyAccountDto } from './dto/update-loyalty_account.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Loyalty Accounts')
@Controller('loyalty-accounts')
export class LoyaltyAccountsController {
    constructor(private readonly loyaltyAccountsService: LoyaltyAccountsService) { }
    @Post()
    @ApiOperation({ summary: 'Create loyalty account' })
    create(
    @Body()
    createLoyaltyAccountDto: CreateLoyaltyAccountDto) {
        return this.loyaltyAccountsService.create(createLoyaltyAccountDto);
    }
    @Get()
    @ApiOperation({ summary: 'List loyalty accounts with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.loyaltyAccountsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get loyalty account by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.loyaltyAccountsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update loyalty account' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateLoyaltyAccountDto: UpdateLoyaltyAccountDto) {
        return this.loyaltyAccountsService.update(id, updateLoyaltyAccountDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete loyalty account' })
    remove(
    @Param('id')
    id: string) {
        return this.loyaltyAccountsService.remove(id);
    }
}
