import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CorporateContractsService } from './corporate_contracts.service';
import { CreateCorporateContractDto } from './dto/create-corporate_contract.dto';
import { UpdateCorporateContractDto } from './dto/update-corporate_contract.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Corporate Contracts')
@Controller('corporate-contracts')
export class CorporateContractsController {
    constructor(private readonly corporateContractsService: CorporateContractsService) { }
    @Post()
    @ApiOperation({ summary: 'Create corporate contract (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createCorporateContractDto: CreateCorporateContractDto) {
        return this.corporateContractsService.create(createCorporateContractDto);
    }
    @Get()
    @ApiOperation({ summary: 'List corporate contracts with pagination (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    findAll(
    @Query()
    page: PaginationDto) {
        return this.corporateContractsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get corporate contract by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.corporateContractsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update corporate contract (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateCorporateContractDto: UpdateCorporateContractDto) {
        return this.corporateContractsService.update(id, updateCorporateContractDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete corporate contract (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.corporateContractsService.remove(id);
    }
}
