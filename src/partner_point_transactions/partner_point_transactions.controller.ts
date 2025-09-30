import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PartnerPointTransactionsService } from './partner_point_transactions.service';
import { CreatePartnerPointTransactionDto } from './dto/create-partner_point_transaction.dto';
import { UpdatePartnerPointTransactionDto } from './dto/update-partner_point_transaction.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Partner Point Transactions')
@Controller('partner-point-transactions')
export class PartnerPointTransactionsController {
    constructor(private readonly partnerPointTransactionsService: PartnerPointTransactionsService) { }
    @Post()
    @ApiOperation({ summary: 'Create partner point transaction' })
    create(
    @Body()
    createPartnerPointTransactionDto: CreatePartnerPointTransactionDto) {
        return this.partnerPointTransactionsService.create(createPartnerPointTransactionDto);
    }
    @Get()
    @ApiOperation({ summary: 'List partner point transactions with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.partnerPointTransactionsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get partner point transaction by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.partnerPointTransactionsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update partner point transaction' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updatePartnerPointTransactionDto: UpdatePartnerPointTransactionDto) {
        return this.partnerPointTransactionsService.update(id, updatePartnerPointTransactionDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete partner point transaction' })
    remove(
    @Param('id')
    id: string) {
        return this.partnerPointTransactionsService.remove(id);
    }
}
