import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketsCouponDto } from './dto/create-tickets_coupon.dto';
import { UpdateTicketsCouponDto } from './dto/update-tickets_coupon.dto';
import { TicketsCoupon } from './entities/tickets_coupon.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class TicketsCouponsService {
    constructor(
    @InjectRepository(TicketsCoupon)
    private readonly repo: Repository<TicketsCoupon>) { }
    async create(dto: CreateTicketsCouponDto) {
        if (!dto.ticket_id || !dto.flight_instance_id || !dto.sequence_no) {
            throw new BadRequestException('ticket_id, flight_instance_id, sequence_no majburiy');
        }
        const existsSeq = await this.repo.findOne({ where: { ticket_id: dto.ticket_id, sequence_no: dto.sequence_no } });
        if (existsSeq)
            throw new ConflictException('Bu sequence_no ushbu ticket uchun allaqachon mavjud');
        const existsInst = await this.repo.findOne({ where: { ticket_id: dto.ticket_id, flight_instance_id: dto.flight_instance_id } });
        if (existsInst)
            throw new ConflictException('Bu flight_instance ushbu ticket uchun allaqachon mavjud');
        if (dto.coupon_status && !['OPEN', 'FLOWN', 'VOID', 'REFUNDED'].includes(dto.coupon_status)) {
            throw new BadRequestException('coupon_status noto‘g‘ri');
        }
        let coupon: TicketsCoupon;
        await this.repo.manager.transaction(async (manager) => {
            coupon = manager.create(TicketsCoupon, dto);
            coupon = await manager.save(coupon);
        });
        return coupon!;
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('c').skip(skip).take(take);
        applySorting(qb, 'c', { default: 'id', id: 'id', sequence_no: 'sequence_no', created_at: 'created_at' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('Coupon not found');
        return entity;
    }
    async update(id: string, dto: UpdateTicketsCouponDto) {
        const coupon = await this.findOne(id);
        if (!coupon)
            throw new NotFoundException('Coupon not found');
        if (dto.sequence_no && dto.sequence_no !== coupon.sequence_no) {
            const existsSeq = await this.repo.findOne({ where: { ticket_id: coupon.ticket_id, sequence_no: dto.sequence_no } });
            if (existsSeq)
                throw new ConflictException('Bu sequence_no ushbu ticket uchun allaqachon mavjud');
        }
        if (dto.flight_instance_id && dto.flight_instance_id !== coupon.flight_instance_id) {
            const existsInst = await this.repo.findOne({ where: { ticket_id: coupon.ticket_id, flight_instance_id: dto.flight_instance_id } });
            if (existsInst)
                throw new ConflictException('Bu flight_instance ushbu ticket uchun allaqachon mavjud');
        }
        if (dto.coupon_status && !['OPEN', 'FLOWN', 'VOID', 'REFUNDED'].includes(dto.coupon_status)) {
            throw new BadRequestException('coupon_status noto‘g‘ri');
        }
        let updated: TicketsCoupon | null = null;
        await this.repo.manager.transaction(async (manager) => {
            await manager.update(TicketsCoupon, { id }, dto as Partial<TicketsCoupon>);
            updated = await manager.findOne(TicketsCoupon, { where: { id } });
        });
        if (!updated)
            throw new NotFoundException('Coupon not found');
        return updated;
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Coupon not found');
        return { success: true };
    }
}
