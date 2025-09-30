import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class ReviewsService {
    constructor(
    @InjectRepository(Review)
    private readonly repo: Repository<Review>) { }
    async create(dto: CreateReviewDto) {
        if (!dto.user_id)
            throw new BadRequestException('user_id majburiy');
        if (!dto.flight_id && !dto.airline_id)
            throw new BadRequestException('flight_id yoki airline_id majburiy');
        if (dto.comment && (dto.comment.length < 10 || dto.comment.length > 1000)) {
            throw new BadRequestException('comment uzunligi 10-1000 belgidan iborat bo‘lishi kerak');
        }
        let review: Review;
        await this.repo.manager.transaction(async (manager) => {
            review = manager.create(Review, { ...dto, status: 'PENDING' });
            review = await manager.save(review);
        });
        return review!;
    }
    findAll(page: PaginationDto, filters?: {
        flightId?: string;
        airlineId?: string;
        status?: 'PENDING' | 'PUBLISHED' | 'REJECTED';
    }) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('r').skip(skip).take(take);
        if (filters?.flightId)
            qb.andWhere('r.flight_id = :flightId', { flightId: filters.flightId });
        if (filters?.airlineId)
            qb.andWhere('r.airline_id = :airlineId', { airlineId: filters.airlineId });
        if (filters?.status)
            qb.andWhere('r.status = :status', { status: filters.status });
        applySorting(qb, 'r', { default: 'created_at', created_at: 'created_at', rating: 'rating', id: 'id' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Review not found');
        return e;
    }
    async update(id: string, dto: UpdateReviewDto) {
        const review = await this.findOne(id);
        if (!review)
            throw new NotFoundException('Review not found');
        if (review.status !== 'PENDING') {
            throw new BadRequestException('Faqat PENDING reviewni o‘zgartirish mumkin');
        }
        if (dto.comment && (dto.comment.length < 10 || dto.comment.length > 1000)) {
            throw new BadRequestException('comment uzunligi 10-1000 belgidan iborat bo‘lishi kerak');
        }
        let updated: Review | null = null;
        await this.repo.manager.transaction(async (manager) => {
            await manager.update(Review, { id }, dto as Partial<Review>);
            updated = await manager.findOne(Review, { where: { id } });
        });
        if (!updated)
            throw new NotFoundException('Updated review not found');
        return updated;
    }
    async remove(id: string) {
        const review = await this.findOne(id);
        if (!review)
            throw new NotFoundException('Review not found');
        if (review.status === 'PUBLISHED') {
            throw new BadRequestException('PUBLISHED reviewni o‘chirish mumkin emas');
        }
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Review not found');
        return { success: true };
    }
    async publish(id: string) {
        const r = await this.findOne(id);
        if (r.status !== 'PENDING')
            throw new BadRequestException('Faqat PENDING reviewni publish qilish mumkin');
        r.status = 'PUBLISHED';
        r.published_at = new Date();
        await this.repo.save(r);
        return r;
    }
    async reject(id: string) {
        const r = await this.findOne(id);
        if (r.status !== 'PENDING')
            throw new BadRequestException('Faqat PENDING reviewni reject qilish mumkin');
        r.status = 'REJECTED';
        await this.repo.save(r);
        return r;
    }
}
