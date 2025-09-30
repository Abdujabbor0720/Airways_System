import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Referrals')
@Controller('referrals')
export class ReferralsController {
    constructor(private readonly referralsService: ReferralsService) { }
    @Post()
    @ApiOperation({ summary: 'Create referral (user)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    create(
    @Body()
    createReferralDto: CreateReferralDto) {
        return this.referralsService.create(createReferralDto);
    }
    @Get()
    @ApiOperation({ summary: 'List referrals with pagination (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    findAll(
    @Query()
    page: PaginationDto) {
        return this.referralsService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get referral by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.referralsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update referral (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateReferralDto: UpdateReferralDto) {
        return this.referralsService.update(id, updateReferralDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete referral (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.referralsService.remove(id);
    }
}
