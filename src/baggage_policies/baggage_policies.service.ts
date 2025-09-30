import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBaggagePolicyDto } from './dto/create-baggage_policy.dto';
import { UpdateBaggagePolicyDto } from './dto/update-baggage_policy.dto';
import { BaggagePolicy } from './entities/baggage_policy.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class BaggagePoliciesService {
    admin_activity_logs;
    constructor(
    @InjectRepository(BaggagePolicy)
    private readonly repo: Repository<BaggagePolicy>) { }
    create(dto: CreateBaggagePolicyDto) {
        return this.repo.save(this.repo.create(dto as Partial<BaggagePolicy>));
    }
    findAll(page: PaginationDto, airlineId?: string) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('p').skip(skip).take(take);
        if (airlineId)
            qb.andWhere('p.airline_id = :airlineId', { airlineId });
        applySorting(qb, 'p', { default: 'id', id: 'id', max_pieces: 'max_pieces', created_at: 'created_at' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Baggage policy not found');
        return e;
    }
    async update(id: string, dto: UpdateBaggagePolicyDto) {
        await this.repo.update({ id }, dto as Partial<BaggagePolicy>);
        return this.findOne(id);
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Baggage policy not found');
        return { success: true };
    }
}
