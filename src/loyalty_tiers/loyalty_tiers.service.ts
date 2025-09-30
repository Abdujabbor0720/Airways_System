import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoyaltyTierDto } from './dto/create-loyalty_tier.dto';
import { UpdateLoyaltyTierDto } from './dto/update-loyalty_tier.dto';
import { LoyaltyTier } from './entities/loyalty_tier.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class LoyaltyTiersService {
    constructor(
    @InjectRepository(LoyaltyTier)
    private readonly repo: Repository<LoyaltyTier>) { }
    create(dto: CreateLoyaltyTierDto) {
        return this.repo.save(this.repo.create(dto as Partial<LoyaltyTier>));
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 50, 200);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('t').skip(skip).take(take);
        applySorting(qb, 't', { default: 'min_points', min_points: 'min_points', name: 'name', id: 'id' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Tier not found');
        return e;
    }
    async update(id: string, dto: UpdateLoyaltyTierDto) {
        await this.repo.update({ id }, dto as Partial<LoyaltyTier>);
        return this.findOne(id);
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Tier not found');
        return { success: true };
    }
    async findBestTierForPoints(points: number) {
        return this.repo
            .createQueryBuilder('t')
            .where('t.min_points <= :points', { points })
            .orderBy('t.min_points', 'DESC')
            .getOne();
    }
}
