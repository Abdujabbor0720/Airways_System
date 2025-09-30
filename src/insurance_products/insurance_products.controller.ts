import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InsuranceProductsService } from './insurance_products.service';
import { CreateInsuranceProductDto } from './dto/create-insurance_product.dto';
import { UpdateInsuranceProductDto } from './dto/update-insurance_product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Insurance Products')
@Controller('insurance-products')
export class InsuranceProductsController {
    constructor(private readonly insuranceProductsService: InsuranceProductsService) { }
    @Post()
    @ApiOperation({ summary: 'Create insurance product' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createInsuranceProductDto: CreateInsuranceProductDto) {
        return this.insuranceProductsService.create(createInsuranceProductDto);
    }
    @Get()
    @ApiOperation({ summary: 'List insurance products with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.insuranceProductsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get insurance product by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.insuranceProductsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update insurance product' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateInsuranceProductDto: UpdateInsuranceProductDto) {
        return this.insuranceProductsService.update(id, updateInsuranceProductDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete insurance product' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.insuranceProductsService.remove(id);
    }
}
