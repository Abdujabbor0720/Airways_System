import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoyaltyPointsLedgerService } from './loyalty_points_ledger.service';
import { CreateLoyaltyPointsLedgerDto } from './dto/create-loyalty_points_ledger.dto';
import { UpdateLoyaltyPointsLedgerDto } from './dto/update-loyalty_points_ledger.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Loyalty Points Ledger')
@Controller('loyalty-points-ledger')
export class LoyaltyPointsLedgerController {
    constructor(private readonly loyaltyPointsLedgerService: LoyaltyPointsLedgerService) { }
    @Post()
    @ApiOperation({ summary: 'Create loyalty points ledger entry' })
    create(
    @Body()
    createLoyaltyPointsLedgerDto: CreateLoyaltyPointsLedgerDto) {
        return this.loyaltyPointsLedgerService.create(createLoyaltyPointsLedgerDto);
    }
    @Get()
    @ApiOperation({ summary: 'List loyalty points ledger with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.loyaltyPointsLedgerService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get loyalty points ledger entry by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.loyaltyPointsLedgerService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update loyalty points ledger entry' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateLoyaltyPointsLedgerDto: UpdateLoyaltyPointsLedgerDto) {
        return this.loyaltyPointsLedgerService.update(id, updateLoyaltyPointsLedgerDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete loyalty points ledger entry' })
    remove(
    @Param('id')
    id: string) {
        return this.loyaltyPointsLedgerService.remove(id);
    }
}
