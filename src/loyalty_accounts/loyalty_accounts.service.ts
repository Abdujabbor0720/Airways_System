import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoyaltyAccountDto } from './dto/create-loyalty_account.dto';
import { UpdateLoyaltyAccountDto } from './dto/update-loyalty_account.dto';
import { LoyaltyAccount } from './entities/loyalty_account.entity';
import { LoyaltyTiersService } from '../loyalty_tiers/loyalty_tiers.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class LoyaltyAccountsService {
    constructor(
    @InjectRepository(LoyaltyAccount)
    private readonly repo: Repository<LoyaltyAccount>, private readonly tiers: LoyaltyTiersService) { }
    create(dto: CreateLoyaltyAccountDto) {
        return this.repo.save(this.repo.create(dto as Partial<LoyaltyAccount>));
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('a').skip(skip).take(take);
        applySorting(qb, 'a', { default: 'id', id: 'id', points_balance: 'points_balance', created_at: 'created_at' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Account not found');
        return e;
    }
    async update(id: string, dto: UpdateLoyaltyAccountDto) {
        await this.repo.update({ id }, dto as Partial<LoyaltyAccount>);
        return this.findOne(id);
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Account not found');
        return { success: true };
    }
    async getOrCreateByUserId(userId: string) {
        let acc = await this.repo.findOne({ where: { user_id: userId } });
        if (!acc)
            acc = await this.repo.save(this.repo.create({ user_id: userId }));
        return acc;
    }
    async adjustPointsAndRecalcTier(accountId: string, delta: number) {
        const acc = await this.findOne(accountId);
        const next = acc.points_balance + delta;
        acc.points_balance = next;
        const tier = await this.tiers.findBestTierForPoints(next);
        acc.tier_id = tier?.id ?? null;
        await this.repo.save(acc);
        return acc;
    }
}
