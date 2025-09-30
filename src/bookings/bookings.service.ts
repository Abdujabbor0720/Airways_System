import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { BookingHistory } from '../booking_history/entities/booking_history.entity';
import { generatePNR } from '../common/utils/id.util';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class BookingsService {
    constructor(
    @InjectRepository(Booking)
    private readonly repo: Repository<Booking>, 
    @InjectRepository(BookingHistory)
    private readonly historyRepo: Repository<BookingHistory>, private readonly dataSource: DataSource) { }
    async create(dto: CreateBookingDto) {
        return this.dataSource.transaction(async (manager) => {
            let attempts = 0;
            while (attempts < 6) {
                attempts++;
                const pnr = generatePNR();
                try {
                    const entity = manager.create(Booking, {
                        user_id: dto.user_id,
                        pnr_code: pnr,
                        trip_type: dto.trip_type,
                        status: 'PENDING',
                        currency_code: dto.currency_code ?? 'USD',
                        fare_total: (dto.fare_total ?? '0').toString(),
                        contact_email: dto.contact_email,
                        contact_phone: dto.contact_phone,
                    } as Partial<Booking>);
                    const saved = await manager.save(entity);
                    await manager.save(manager.create(BookingHistory, {
                        booking_id: saved.id,
                        action: 'BOOKING_CREATED',
                        actor_type: 'USER',
                        actor_id: dto.user_id ?? null,
                        details: { pnr: saved.pnr_code },
                    } as Partial<BookingHistory>));
                    return saved;
                }
                catch (e: any) {
                    if (e?.code === '23505') {
                        continue;
                    }
                    throw e;
                }
            }
            throw new Error('Failed to allocate unique PNR after multiple attempts');
        });
    }
    async findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('b').skip(skip).take(take);
        applySorting(qb, 'b', { default: 'created_at', created_at: 'created_at', id: 'id', fare_total: 'fare_total' }, page.sort, page.order);
        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }
    async findOne(id: string) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('Booking not found');
        return entity;
    }
    async update(id: string, dto: UpdateBookingDto) {
        const booking = await this.repo.findOne({ where: { id } });
        if (!booking)
            throw new NotFoundException('Booking not found');
        if (booking.status !== 'PENDING' && booking.status !== 'HOLD') {
            throw new Error('Faqat PENDING yoki HOLD booking o‘zgartiriladi');
        }
        await this.repo.update({ id }, dto as Partial<Booking>);
        return this.findOne(id);
    }
    async remove(id: string) {
        const booking = await this.repo.findOne({ where: { id } });
        if (!booking)
            throw new NotFoundException('Booking not found');
        if (booking.status !== 'PENDING') {
            throw new Error('Faqat PENDING booking o‘chiriladi');
        }
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Booking not found');
        return { success: true };
    }
}
