import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { BookingPassenger } from '../booking_passengers/entities/booking_passenger.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
import { generateTicketNumber } from '../common/utils/id.util';
@Injectable()
export class TicketsService {
    constructor(
    @InjectRepository(Ticket)
    private readonly repo: Repository<Ticket>, 
    @InjectRepository(BookingPassenger)
    private readonly bpRepo: Repository<BookingPassenger>, private readonly dataSource: DataSource) { }
    async create(createTicketDto: CreateTicketDto) {
        if (!createTicketDto.booking_id || !createTicketDto.passenger_id || !createTicketDto.ticket_number) {
            throw new BadRequestException('booking_id, passenger_id, ticket_number majburiy');
        }
        const exists = await this.repo.findOne({ where: { ticket_number: createTicketDto.ticket_number } });
        if (exists) {
            throw new ConflictException('Bu ticket_number allaqachon mavjud');
        }
        let ticket: Ticket;
        await this.repo.manager.transaction(async (manager) => {
            ticket = manager.create(Ticket, createTicketDto);
            ticket = await manager.save(ticket);
        });
        return ticket!;
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('t').skip(skip).take(take);
        applySorting(qb, 't', { default: 'id', id: 'id', ticket_number: 'ticket_number', issued_at: 'issued_at' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('Ticket not found');
        return entity;
    }
    async update(id: string, updateTicketDto: UpdateTicketDto) {
        const ticket = await this.findOne(id);
        if (!ticket)
            throw new NotFoundException('Ticket not found');
        if (ticket.status !== 'ACTIVE') {
            throw new ConflictException('Faqat ACTIVE ticketni o‘zgartirish mumkin');
        }
        if (updateTicketDto.ticket_number && updateTicketDto.ticket_number !== ticket.ticket_number) {
            const exists = await this.repo.findOne({ where: { ticket_number: updateTicketDto.ticket_number } });
            if (exists)
                throw new ConflictException('Bu ticket_number allaqachon mavjud');
        }
        let updated: Ticket | undefined = undefined;
        await this.repo.manager.transaction(async (manager) => {
            await manager.update(Ticket, { id }, updateTicketDto as Partial<Ticket>);
            const found = await manager.findOne(Ticket, { where: { id } });
            updated = found === null ? undefined : found;
            if (!updated) {
                throw new NotFoundException('Updated ticket not found');
            }
        });
        return updated!;
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Ticket not found');
        return { success: true };
    }
    async issueForBooking(bookingId: string) {
        return this.dataSource.transaction(async (manager) => {
            const bps = await manager.find(BookingPassenger, { where: { booking_id: bookingId } });
            if (bps.length === 0)
                throw new NotFoundException('No passengers in booking');
            const created: Ticket[] = [];
            for (const bp of bps) {
                const exists = await manager.findOne(Ticket, { where: { booking_id: bookingId, passenger_id: bp.passenger_id } });
                if (exists)
                    continue;
                let number = generateTicketNumber();
                for (let i = 0; i < 5; i++) {
                    try {
                        const t = await manager.save(manager.create(Ticket, {
                            booking_id: bookingId,
                            passenger_id: bp.passenger_id,
                            ticket_number: number,
                            status: 'ACTIVE',
                        } as Partial<Ticket>));
                        created.push(t);
                        break;
                    }
                    catch (e: any) {
                        if (e?.code === '23505') {
                            number = generateTicketNumber();
                            continue;
                        }
                        throw e;
                    }
                }
            }
            return { created };
        });
    }
}
