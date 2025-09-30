import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateBaggageItemDto } from './dto/create-baggage_item.dto';
import { UpdateBaggageItemDto } from './dto/update-baggage_item.dto';
import { BaggageItem } from './entities/baggage_item.entity';
import { TicketsCoupon } from '../tickets_coupons/entities/tickets_coupon.entity';
import { FareClass } from '../fare_classes/entities/fare_class.entity';
import { BaggagePolicy } from '../baggage_policies/entities/baggage_policy.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class BaggageItemsService {
    constructor(
    @InjectRepository(BaggageItem)
    private readonly repo: Repository<BaggageItem>, 
    @InjectRepository(TicketsCoupon)
    private readonly couponRepo: Repository<TicketsCoupon>, 
    @InjectRepository(FareClass)
    private readonly fareRepo: Repository<FareClass>, 
    @InjectRepository(BaggagePolicy)
    private readonly policyRepo: Repository<BaggagePolicy>, private readonly dataSource: DataSource) { }
    async create(dto: CreateBaggageItemDto) {
        return this.dataSource.transaction(async (manager) => {
            const coupon = await manager.findOne(TicketsCoupon, { where: { id: dto.ticket_coupon_id } });
            if (!coupon)
                throw new NotFoundException('Ticket coupon not found');
            let policy: BaggagePolicy | null = null;
            if (coupon.fare_class_id) {
                const fare = await manager.findOne(FareClass, { where: { id: coupon.fare_class_id } });
                if (fare?.baggage_policy_id) {
                    policy = await manager.findOne(BaggagePolicy, { where: { id: fare.baggage_policy_id } });
                }
            }
            if (policy) {
                if (policy.max_pieces != null) {
                    const currentPieces = await manager.count(BaggageItem, { where: { ticket_coupon_id: dto.ticket_coupon_id } });
                    if (currentPieces + 1 > policy.max_pieces) {
                        throw new BadRequestException('Baggage pieces exceed policy limit');
                    }
                }
                if (dto.weight_kg) {
                    const weight = Number(dto.weight_kg);
                    if (dto.is_carry_on) {
                        if (policy.carry_on_weight_kg != null && weight > Number(policy.carry_on_weight_kg)) {
                            throw new BadRequestException('Carry-on weight exceeds policy limit');
                        }
                    }
                    else {
                        if (policy.max_weight_kg != null && weight > Number(policy.max_weight_kg)) {
                            throw new BadRequestException('Checked baggage weight exceeds policy limit');
                        }
                    }
                }
            }
            try {
                return await manager.save(manager.create(BaggageItem, dto as Partial<BaggageItem>));
            }
            catch (e: any) {
                if (e?.code === '23505')
                    throw new ConflictException('Duplicate baggage piece number');
                throw e;
            }
        });
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('b').skip(skip).take(take);
        applySorting(qb, 'b', { default: 'id', id: 'id', piece_no: 'piece_no', created_at: 'created_at' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('Baggage item not found');
        return entity;
    }
    async update(): Promise<never> {
        throw new BadRequestException('Baggage items are immutable and cannot be updated');
    }
    async remove(): Promise<never> {
        throw new BadRequestException('Baggage items are immutable and cannot be deleted');
    }
}
