import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoyaltyPointsLedgerDto } from './dto/create-loyalty_points_ledger.dto';
import { UpdateLoyaltyPointsLedgerDto } from './dto/update-loyalty_points_ledger.dto';
import { LoyaltyPointsLedger } from './entities/loyalty_points_ledger.entity';
import { LoyaltyAccountsService } from '../loyalty_accounts/loyalty_accounts.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class LoyaltyPointsLedgerService {
    constructor(
    @InjectRepository(LoyaltyPointsLedger)
    private readonly repo: Repository<LoyaltyPointsLedger>, private readonly accounts: LoyaltyAccountsService) { }
    async create(dto: CreateLoyaltyPointsLedgerDto) {
        const entry = await this.repo.save(this.repo.create(dto as Partial<LoyaltyPointsLedger>));
        await this.accounts.adjustPointsAndRecalcTier(entry.account_id, entry.delta_points);
        return entry;
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('l').skip(skip).take(take);
        applySorting(qb, 'l', { default: 'id', id: 'id', created_at: 'created_at', delta_points: 'delta_points' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Ledger entry not found');
        return e;
    }
    async update(id: string, dto: UpdateLoyaltyPointsLedgerDto) {
        await this.repo.update({ id }, dto as Partial<LoyaltyPointsLedger>);
        return this.findOne(id);
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Ledger entry not found');
        return { success: true };
    }
}
