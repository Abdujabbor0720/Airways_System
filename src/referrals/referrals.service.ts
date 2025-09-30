import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { Referral } from './entities/referral.entity';
import { LoyaltyAccountsService } from '../loyalty_accounts/loyalty_accounts.service';
import { LoyaltyPointsLedgerService } from '../loyalty_points_ledger/loyalty_points_ledger.service';
import { CreateLoyaltyPointsLedgerDto } from '../loyalty_points_ledger/dto/create-loyalty_points_ledger.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class ReferralsService {
    constructor(
    @InjectRepository(Referral)
    private readonly repo: Repository<Referral>, private readonly accounts: LoyaltyAccountsService, private readonly ledger: LoyaltyPointsLedgerService) { }
    async create(dto: CreateReferralDto) {
        if (!dto.referrer_user_id || !dto.referee_user_id) {
            throw new BadRequestException('referrer_user_id va referee_user_id majburiy');
        }
        const exists = await this.repo.findOne({ where: { referee_user_id: dto.referee_user_id } });
        if (exists) {
            throw new ConflictException('Bu referee_user_id allaqachon referral qilingan');
        }
        if (dto.code_used) {
            const codeExists = await this.repo.findOne({ where: { code_used: dto.code_used } });
            if (codeExists)
                throw new ConflictException('Bu referral code allaqachon ishlatilgan');
        }
        let referral: Referral;
        await this.repo.manager.transaction(async (manager) => {
            referral = manager.create(Referral, dto);
            referral = await manager.save(referral);
        });
        return referral!;
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('r').skip(skip).take(take);
        applySorting(qb, 'r', { default: 'id', id: 'id', created_at: 'created_at', status: 'status' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Referral not found');
        return e;
    }
    async update(id: string, dto: UpdateReferralDto) {
        const referral = await this.findOne(id);
        if (!referral)
            throw new NotFoundException('Referral not found');
        if (referral.status !== 'PENDING') {
            throw new ConflictException('Faqat PENDING referralni o‘zgartirish mumkin');
        }
        if (dto.referee_user_id && dto.referee_user_id !== referral.referee_user_id) {
            const exists = await this.repo.findOne({ where: { referee_user_id: dto.referee_user_id } });
            if (exists)
                throw new ConflictException('Bu referee_user_id allaqachon referral qilingan');
        }
        if (dto.code_used && dto.code_used !== referral.code_used) {
            const codeExists = await this.repo.findOne({ where: { code_used: dto.code_used } });
            if (codeExists)
                throw new ConflictException('Bu referral code allaqachon ishlatilgan');
        }
        let updated: Referral | undefined = undefined;
        await this.repo.manager.transaction(async (manager) => {
            await manager.update(Referral, { id }, dto as Partial<Referral>);
            const found = await manager.findOne(Referral, { where: { id } });
            updated = found === null ? undefined : found;
            if (!updated) {
                throw new NotFoundException('Referral not found after update');
            }
        });
        return updated!;
    }
    async remove(id: string) {
        const referral = await this.findOne(id);
        if (!referral)
            throw new NotFoundException('Referral not found');
        if (referral.status === 'APPROVED') {
            throw new ConflictException('APPROVED referralni o‘chirish mumkin emas');
        }
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Referral not found');
        return { success: true };
    }
    async approve(id: string, rewardPoints: number) {
        const r = await this.findOne(id);
        r.status = 'APPROVED';
        r.reward_points = rewardPoints;
        r.approved_at = new Date();
        await this.repo.save(r);
        const refAcc = await this.accounts.getOrCreateByUserId(r.referrer_user_id);
        const entry1: CreateLoyaltyPointsLedgerDto = { account_id: refAcc.id, delta_points: rewardPoints, reason: 'REFERRAL_REWARD' };
        await this.ledger.create(entry1);
        const refdAcc = await this.accounts.getOrCreateByUserId(r.referee_user_id);
        const entry2: CreateLoyaltyPointsLedgerDto = { account_id: refdAcc.id, delta_points: rewardPoints, reason: 'REFERRAL_REWARD' };
        await this.ledger.create(entry2);
        return r;
    }
}
