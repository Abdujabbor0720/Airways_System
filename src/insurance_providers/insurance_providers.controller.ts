import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InsuranceProvidersService } from './insurance_providers.service';
import { CreateInsuranceProviderDto } from './dto/create-insurance_provider.dto';
import { UpdateInsuranceProviderDto } from './dto/update-insurance_provider.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Insurance Providers')
@Controller('insurance-providers')
export class InsuranceProvidersController {
    constructor(private readonly insuranceProvidersService: InsuranceProvidersService) { }
    @Post()
    @ApiOperation({ summary: 'Create insurance provider' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createInsuranceProviderDto: CreateInsuranceProviderDto) {
        return this.insuranceProvidersService.create(createInsuranceProviderDto);
    }
    @Get()
    @ApiOperation({ summary: 'List insurance providers with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.insuranceProvidersService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get insurance provider by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.insuranceProvidersService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update insurance provider' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateInsuranceProviderDto: UpdateInsuranceProviderDto) {
        return this.insuranceProvidersService.update(id, updateInsuranceProviderDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete insurance provider' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.insuranceProvidersService.remove(id);
    }
}
