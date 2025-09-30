import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupportTicketDto } from './dto/create-support_ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support_ticket.dto';
import { SupportTicket } from './entities/support_ticket.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class SupportTicketsService {
    constructor(
    @InjectRepository(SupportTicket)
    private readonly repo: Repository<SupportTicket>) { }
    async create(dto: CreateSupportTicketDto) {
        if (!dto.subject)
            throw new BadRequestException('subject majburiy');
        if (dto.category && !['GENERAL', 'BOOKING', 'REFUND', 'TECH', 'OTHER'].includes(dto.category)) {
            throw new BadRequestException('category noto‘g‘ri');
        }
        if (dto.priority && !['LOW', 'NORMAL', 'HIGH', 'URGENT'].includes(dto.priority)) {
            throw new BadRequestException('priority noto‘g‘ri');
        }
        let ticket: SupportTicket;
        await this.repo.manager.transaction(async (manager) => {
            ticket = manager.create(SupportTicket, dto);
            ticket = await manager.save(ticket);
        });
        return ticket!;
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('t').skip(skip).take(take);
        applySorting(qb, 't', { default: 'updated_at', updated_at: 'updated_at', created_at: 'created_at', id: 'id', priority: 'priority', status: 'status' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Support ticket not found');
        return e;
    }
    async update(id: string, dto: UpdateSupportTicketDto) {
        const ticket = await this.findOne(id);
        if (!ticket)
            throw new NotFoundException('Support ticket not found');
        if (dto.status && dto.status !== ticket.status) {
            const validTransitions: Record<string, string[]> = {
                'OPEN': ['PENDING', 'RESOLVED', 'CLOSED'],
                'PENDING': ['RESOLVED', 'CLOSED'],
                'RESOLVED': ['CLOSED'],
                'CLOSED': [],
            };
            const currentStatus = ticket.status as keyof typeof validTransitions;
            const nextStatus = dto.status as string;
            if (!validTransitions[currentStatus]?.includes(nextStatus)) {
                throw new ConflictException(`Statusni ${ticket.status} dan ${dto.status} ga o‘tkazib bo‘lmaydi`);
            }
        }
        if (dto.category && !['GENERAL', 'BOOKING', 'REFUND', 'TECH', 'OTHER'].includes(dto.category)) {
            throw new BadRequestException('category noto‘g‘ri');
        }
        if (dto.priority && !['LOW', 'NORMAL', 'HIGH', 'URGENT'].includes(dto.priority)) {
            throw new BadRequestException('priority noto‘g‘ri');
        }
        let updated: SupportTicket | null = null;
        await this.repo.manager.transaction(async (manager) => {
            await manager.update(SupportTicket, { id }, dto as Partial<SupportTicket>);
            updated = await manager.findOne(SupportTicket, { where: { id } });
        });
        if (!updated)
            throw new NotFoundException('Support ticket not found after update');
        return updated;
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Support ticket not found');
        return { success: true };
    }
}
