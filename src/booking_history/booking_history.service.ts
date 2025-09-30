import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingHistoryDto } from './dto/create-booking_history.dto';
import { UpdateBookingHistoryDto } from './dto/update-booking_history.dto';
import { BookingHistory } from './entities/booking_history.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class BookingHistoryService {
    constructor(
    @InjectRepository(BookingHistory)
    private readonly repo: Repository<BookingHistory>) { }
    async create(dto: CreateBookingHistoryDto): Promise<BookingHistory> {
        const allowedActors = ['USER', 'ADMIN', 'SYSTEM'];
        if (!allowedActors.includes(dto.actor_type))
            throw new NotFoundException('Invalid actor_type');
        if (!dto.booking_id || isNaN(Number(dto.booking_id)))
            throw new NotFoundException('Invalid booking_id');
        if (!dto.state || typeof dto.state !== 'string' || dto.state.length < 3)
            throw new NotFoundException('Invalid state');
        const entity: Partial<BookingHistory> = {
            ...dto,
            created_at: new Date(),
        };
        return await this.repo.save(this.repo.create(entity));
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('h').skip(skip).take(take);
        applySorting(qb, 'h', { default: 'created_at', created_at: 'created_at', id: 'id' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('History not found');
        return e;
    }
    async update(): Promise<never> {
        throw new NotFoundException('Booking history is immutable and cannot be updated');
    }
    async remove(): Promise<never> {
        throw new NotFoundException('Booking history is immutable and cannot be deleted');
    }
    findByBooking(bookingId: string, page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('h').where('h.booking_id = :bookingId', { bookingId }).skip(skip).take(take);
        applySorting(qb, 'h', { default: 'created_at', created_at: 'created_at', id: 'id' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
}
