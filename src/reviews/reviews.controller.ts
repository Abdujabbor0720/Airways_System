import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }
    @Post()
    @ApiOperation({ summary: 'Create review (user)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    create(
    @Body()
    createReviewDto: CreateReviewDto) {
        return this.reviewsService.create(createReviewDto);
    }
    @Get()
    @ApiOperation({ summary: 'List reviews with pagination and filters' })
    @ApiOkResponse({ description: 'List reviews with pagination and filters' })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'flightId', required: false })
    @ApiQuery({ name: 'airlineId', required: false })
    @ApiQuery({ name: 'status', required: false })
    findAll(
    @Query()
    page: PaginationDto, 
    @Query('flightId')
    flightId?: string, 
    @Query('airlineId')
    airlineId?: string, 
    @Query('status')
    status?: 'PENDING' | 'PUBLISHED' | 'REJECTED') {
        return this.reviewsService.findAll(page, { flightId, airlineId, status });
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get review by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.reviewsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update review (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateReviewDto: UpdateReviewDto) {
        return this.reviewsService.update(id, updateReviewDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete review (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.reviewsService.remove(id);
    }
    @Post(':id/publish')
    @ApiOperation({ summary: 'Publish review (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    publish(
    @Param('id')
    id: string) {
        return this.reviewsService.publish(id);
    }
    @Post(':id/reject')
    @ApiOperation({ summary: 'Reject review (admin)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    reject(
    @Param('id')
    id: string) {
        return this.reviewsService.reject(id);
    }
}
