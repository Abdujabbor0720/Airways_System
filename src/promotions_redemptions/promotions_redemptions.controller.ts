import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PromotionsRedemptionsService } from './promotions_redemptions.service';
import { UpdatePromotionsRedemptionDto } from './dto/update-promotions_redemption.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@ApiTags('Promotions Redemptions')
@Controller('promotions-redemptions')
export class PromotionsRedemptionsController {
    constructor(private readonly promotionsRedemptionsService: PromotionsRedemptionsService) { }
    @Get()
    @ApiOperation({ summary: 'List promotion redemptions with pagination' })
    @ApiOkResponse({ description: 'List redemptions with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.promotionsRedemptionsService.findAll(page.offset, page.limit);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get promotion redemption by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.promotionsRedemptionsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update promotion redemption' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updatePromotionsRedemptionDto: UpdatePromotionsRedemptionDto) {
        return this.promotionsRedemptionsService.update(id, updatePromotionsRedemptionDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete promotion redemption' })
    remove(
    @Param('id')
    id: string) {
        return this.promotionsRedemptionsService.remove(id);
    }
    @Post('redeem')
    @ApiOperation({ summary: 'Redeem promotion code' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiBody({ schema: { properties: { code: { type: 'string' }, user_id: { type: 'string', nullable: true }, booking_id: { type: 'string', nullable: true } }, required: ['code'] } })
    redeem(
    @Body()
    body: {
        code: string;
        user_id?: string;
        booking_id?: string;
    }) {
        return this.promotionsRedemptionsService.redeemByCode(body.code, body.user_id, body.booking_id);
    }
}
