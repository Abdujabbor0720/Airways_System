import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaggagePoliciesService } from './baggage_policies.service';
import { CreateBaggagePolicyDto } from './dto/create-baggage_policy.dto';
import { UpdateBaggagePolicyDto } from './dto/update-baggage_policy.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Baggage Policies')
@Controller('baggage-policies')
export class BaggagePoliciesController {
    constructor(private readonly baggagePoliciesService: BaggagePoliciesService) { }
    @Post()
    @ApiOperation({ summary: 'Create baggage policy' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createBaggagePolicyDto: CreateBaggagePolicyDto) {
        return this.baggagePoliciesService.create(createBaggagePolicyDto);
    }
    @Get()
    @ApiOperation({ summary: 'List baggage policies with pagination' })
    @ApiOkResponse({ description: 'List baggage policies with pagination' })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'airlineId', required: false })
    findAll(
    @Query('limit')
    limit = 20, 
    @Query('offset')
    offset = 0, 
    @Query('airlineId')
    airlineId?: string) {
        const page = { offset: Number(offset), limit: Math.min(Number(limit) || 20, 100) };
        return this.baggagePoliciesService.findAll(page, airlineId);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get baggage policy by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.baggagePoliciesService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update baggage policy' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateBaggagePolicyDto: UpdateBaggagePolicyDto) {
        return this.baggagePoliciesService.update(id, updateBaggagePolicyDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete baggage policy' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.baggagePoliciesService.remove(id);
    }
}
