import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { S3Service } from '../common/aws/s3.service';
@ApiTags('News')
@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService, private readonly s3: S3Service) { }
    @Post()
    @ApiOperation({ summary: 'Create news (with optional file upload)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                slug: { type: 'string' },
                body: { type: 'string' },
                status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
                file: { type: 'string', format: 'binary' },
            },
            required: ['title', 'body'],
        },
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        limits: { fileSize: 10 * 1024 * 1024 },
    }))
    async create(
    @Body()
    createNewsDto: CreateNewsDto, 
    @UploadedFile()
    file?: any) {
        let extra: any = {};
        if (file) {
            if (!file.mimetype?.startsWith('image/') && file.mimetype !== 'application/pdf') {
                throw new BadRequestException('Unsupported file type');
            }
            const { key, url } = await this.s3.uploadPublic({
                buffer: file.buffer,
                contentType: file.mimetype,
                prefix: 'news',
                filename: file.originalname,
            });
            extra = {
                image_url: url,
                image_key: key,
                image_content_type: file.mimetype,
                image_size: String(file.size),
            };
        }
        return this.newsService.create(createNewsDto, extra);
    }
    @Get()
    @ApiOperation({ summary: 'List news with pagination' })
    @ApiOkResponse({ description: 'List news with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.newsService.findAll(Number(page.offset ?? 0), Math.min(Number(page.limit ?? 20) || 20, 100));
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get news by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.newsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update news (optionally replace file)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                slug: { type: 'string' },
                body: { type: 'string' },
                status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        limits: { fileSize: 10 * 1024 * 1024 },
    }))
    async update(
    @Param('id')
    id: string, 
    @Body()
    updateNewsDto: UpdateNewsDto,
    @UploadedFile()
    file?: any) {
        let extra: any = undefined;
        if (file) {
            if (!file.mimetype?.startsWith('image/') && file.mimetype !== 'application/pdf') {
                throw new BadRequestException('Unsupported file type');
            }
            const { key, url } = await this.s3.uploadPublic({
                buffer: file.buffer,
                contentType: file.mimetype,
                prefix: 'news',
                filename: file.originalname,
            });
            extra = {
                image_url: url,
                image_key: key,
                image_content_type: file.mimetype,
                image_size: String(file.size),
            };
        }
        return this.newsService.update(id, updateNewsDto, extra);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete news (and remove file from S3 if exists)' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.newsService.remove(id);
    }
}
