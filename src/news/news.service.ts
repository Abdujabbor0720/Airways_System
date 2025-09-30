import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { S3Service } from '../common/aws/s3.service';
@Injectable()
export class NewsService {
    constructor(
    @InjectRepository(News)
    private readonly repo: Repository<News>, private readonly dataSource: DataSource, private readonly s3: S3Service) { }
    async create(dto: CreateNewsDto, extra?: Partial<Pick<News, 'image_url' | 'image_key' | 'image_content_type' | 'image_size'>>) {
        return this.dataSource.transaction(async (manager) => {
            if (dto.slug) {
                const exists = await manager.findOne(News, { where: { slug: dto.slug } });
                if (exists)
                    throw new ConflictException('Slug already exists');
            }
            if (dto.status === 'PUBLISHED' && !dto.slug) {
                throw new BadRequestException('Published news must have a slug');
            }
            const entity = manager.create(News, {
                ...dto,
                published_at: dto.status === 'PUBLISHED' ? new Date() : null,
                image_url: extra?.image_url,
                image_key: extra?.image_key,
                image_content_type: extra?.image_content_type,
                image_size: extra?.image_size,
            } as Partial<News>);
            return await manager.save(entity);
        });
    }
    findAll(skip = 0, take = 20) {
        return this.repo.findAndCount({ order: { created_at: 'DESC' }, skip, take });
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('News not found');
        return e;
    }
    async update(id: string, dto: UpdateNewsDto, extra?: Partial<Pick<News, 'image_url' | 'image_key' | 'image_content_type' | 'image_size'>>) {
        const updated = await this.dataSource.transaction(async (manager) => {
            const news = await manager.findOne(News, { where: { id } });
            if (!news)
                throw new NotFoundException('News not found');
            if (dto.slug) {
                const exists = await manager.findOne(News, { where: { slug: dto.slug } });
                if (exists && exists.id !== id)
                    throw new ConflictException('Slug already exists');
            }
            if (dto.status) {
                const allowed: Record<string, string[]> = {
                    DRAFT: ['PUBLISHED', 'ARCHIVED'],
                    PUBLISHED: ['ARCHIVED'],
                    ARCHIVED: [],
                };
                if (news.status !== dto.status) {
                    const can = allowed[news.status as keyof typeof allowed] ?? [];
                    if (!can.includes(dto.status))
                        throw new BadRequestException('Invalid status transition');
                    if (dto.status === 'PUBLISHED' && !(dto.slug || news.slug))
                        throw new BadRequestException('Published news must have a slug');
                }
            }
            const oldKey = news.image_key;
            const patch: Partial<News> = {
                ...dto,
                published_at: dto.status === 'PUBLISHED' ? new Date() : news.published_at,
            };
            if (extra && (extra.image_key || extra.image_url)) {
                patch.image_url = extra.image_url ?? null;
                patch.image_key = extra.image_key ?? null;
                patch.image_content_type = extra.image_content_type ?? null;
                patch.image_size = extra.image_size ?? null;
            }
            await manager.update(News, { id }, patch);
            const result = await manager.findOne(News, { where: { id } });
            if (result && extra && extra.image_key && oldKey && oldKey !== extra.image_key) {
                await this.s3.deleteObject(oldKey);
            }
            return result!;
        });
        return updated;
    }
    async remove(id: string) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('News not found');
        const key = entity.image_key;
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('News not found');
        if (key) await this.s3.deleteObject(key);
        return { success: true };
    }
}
