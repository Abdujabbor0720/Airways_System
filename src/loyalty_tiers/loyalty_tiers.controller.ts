import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoyaltyTiersService } from './loyalty_tiers.service';
import { CreateLoyaltyTierDto } from './dto/create-loyalty_tier.dto';
import { UpdateLoyaltyTierDto } from './dto/update-loyalty_tier.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Loyalty Tiers')
@Controller('loyalty-tiers')
export class LoyaltyTiersController {
    constructor(private readonly loyaltyTiersService: LoyaltyTiersService) { }
    @Post()
    @ApiOperation({ summary: 'Create loyalty tier' })
    create(
    @Body()
    createLoyaltyTierDto: CreateLoyaltyTierDto) {
        return this.loyaltyTiersService.create(createLoyaltyTierDto);
    }
    @Get()
    @ApiOperation({ summary: 'List loyalty tiers with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.loyaltyTiersService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get loyalty tier by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.loyaltyTiersService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update loyalty tier' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateLoyaltyTierDto: UpdateLoyaltyTierDto) {
        return this.loyaltyTiersService.update(id, updateLoyaltyTierDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete loyalty tier' })
    remove(
    @Param('id')
    id: string) {
        return this.loyaltyTiersService.remove(id);
    }
}
