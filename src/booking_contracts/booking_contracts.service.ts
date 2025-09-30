import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingContractDto } from './dto/create-booking_contract.dto';
import { UpdateBookingContractDto } from './dto/update-booking_contract.dto';
import { BookingContract } from './entities/booking_contract.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class BookingContractsService {
    constructor(
    @InjectRepository(BookingContract)
    private readonly repo: Repository<BookingContract>) { }
    async create(dto: CreateBookingContractDto): Promise<BookingContract> {
        const exists = await this.repo.findOne({ where: { booking_id: dto.booking_id, contract_id: dto.contract_id } });
        if (exists)
            throw new ConflictException('Contract already linked to booking');
        if (!dto.valid_from || !dto.valid_to)
            throw new ConflictException('Contract validity period required');
        if (new Date(dto.valid_from) >= new Date(dto.valid_to))
            throw new ConflictException('Contract validity period is invalid');
        if (!dto.terms || typeof dto.terms !== 'string' || dto.terms.length < 10)
            throw new ConflictException('Contract terms are invalid');
        if (!dto.status || !['ACTIVE', 'EXPIRED', 'CANCELLED'].includes(dto.status))
            throw new ConflictException('Contract status is invalid');
        return await this.repo.manager.transaction(async (manager) => {
            const contract = manager.create(BookingContract, dto);
            const saved = await manager.save(BookingContract, contract);
            return saved;
        });
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('c').skip(skip).take(take);
        applySorting(qb, 'c', { default: 'id', id: 'id' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Booking contract not found');
        return e;
    }
    async update(): Promise<never> {
        throw new ConflictException('Booking contracts are immutable and cannot be updated');
    }
    async remove(): Promise<never> {
        throw new ConflictException('Booking contracts are immutable and cannot be deleted');
    }
}
