import { ConflictException, Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateBookingPassengerDto } from './dto/create-booking_passenger.dto';
import { UpdateBookingPassengerDto } from './dto/update-booking_passenger.dto';
import { BookingPassenger } from './entities/booking_passenger.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
import { Passenger } from '../passengers/entities/passenger.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Seat } from '../seats/entities/seat.entity';
import { BaggageItem } from '../baggage_items/entities/baggage_item.entity';
@Injectable()
export class BookingPassengersService {
    constructor(
    @InjectRepository(BookingPassenger)
    private readonly repo: Repository<BookingPassenger>, 
    @InjectRepository(Passenger)
    private readonly passengerRepo: Repository<Passenger>, 
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>, 
    @InjectRepository(Seat)
    private readonly seatRepo: Repository<Seat>, 
    @InjectRepository(BaggageItem)
    private readonly baggageRepo: Repository<BaggageItem>, private readonly dataSource: DataSource) { }
    async create(dto: CreateBookingPassengerDto) {
        return this.dataSource.transaction(async (manager) => {
            const passenger = await manager.findOne(Passenger, { where: { id: dto.passenger_id } });
            if (!passenger)
                throw new NotFoundException('Passenger topilmadi');
            if (!passenger.first_name || !passenger.last_name)
                throw new BadRequestException('Ism va familiya majburiy');
            if (!passenger.gender)
                throw new BadRequestException('Gender majburiy');
            if (!passenger.document_type || !passenger.document_number)
                throw new BadRequestException('Hujjat turi va raqami majburiy');
            if (!passenger.nationality_country_id)
                throw new BadRequestException('Millati majburiy');
            const exists = await manager.findOne(BookingPassenger, {
                where: { booking_id: dto.booking_id, passenger_id: dto.passenger_id },
            });
            if (exists)
                throw new ConflictException('Bu booking uchun passenger allaqachon biriktirilgan');
            const entity = manager.create(BookingPassenger, {
                booking_id: dto.booking_id,
                passenger_id: dto.passenger_id,
                passenger_type: dto.passenger_type,
                is_primary_contact: dto.is_primary_contact ?? false,
                document_type: dto.document_type ?? null,
                document_number: dto.document_number ?? null,
                gender: dto.gender ?? null,
                nationality_country_id: dto.nationality_country_id ?? null,
            } as Partial<BookingPassenger>);
            try {
                return await manager.save(entity);
            }
            catch (e: any) {
                if (e?.code === '23505')
                    throw new ConflictException('Passenger already in booking');
                throw e;
            }
        });
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('bp').skip(skip).take(take);
        applySorting(qb, 'bp', { default: 'id', id: 'id' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('Booking passenger topilmadi');
        return entity;
    }
    async update(id: string, dto: UpdateBookingPassengerDto) {
        const bp = await this.repo.findOne({ where: { id } });
        if (!bp)
            throw new NotFoundException('Booking passenger topilmadi');
        await this.repo.update({ id }, {
            document_type: dto.document_type ?? bp.document_type,
            document_number: dto.document_number ?? bp.document_number,
            gender: dto.gender ?? bp.gender,
            nationality_country_id: dto.nationality_country_id ?? bp.nationality_country_id,
            is_primary_contact: dto.is_primary_contact ?? bp.is_primary_contact,
        });
        return this.findOne(id);
    }
    async remove(id: string) {
        const bp = await this.repo.findOne({ where: { id } });
        if (!bp)
            throw new NotFoundException('Booking passenger topilmadi');
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Booking passenger topilmadi');
        return { success: true };
    }
}
