import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupportMessageDto } from './dto/create-support_message.dto';
import { UpdateSupportMessageDto } from './dto/update-support_message.dto';
import { SupportMessage } from './entities/support_message.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class SupportMessagesService {
    constructor(
    @InjectRepository(SupportMessage)
    private readonly repo: Repository<SupportMessage>) { }
    async create(dto: CreateSupportMessageDto) {
        if (!dto.support_ticket_id || !dto.sender_type || !dto.message) {
            throw new BadRequestException('support_ticket_id, sender_type, message majburiy');
        }
        if (dto.sender_type === 'USER' && !dto.sender_user_id) {
            throw new BadRequestException('USER uchun sender_user_id majburiy');
        }
        if (dto.sender_type === 'ADMIN' && !dto.sender_admin_id) {
            throw new BadRequestException('ADMIN uchun sender_admin_id majburiy');
        }
        if (dto.message.length < 2 || dto.message.length > 2000) {
            throw new BadRequestException('message uzunligi 2-2000 belgidan iborat bo‘lishi kerak');
        }
        let msg: SupportMessage;
        await this.repo.manager.transaction(async (manager) => {
            msg = manager.create(SupportMessage, dto);
            msg = await manager.save(msg);
        });
        return msg!;
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('m').skip(skip).take(take);
        applySorting(qb, 'm', { default: 'created_at', created_at: 'created_at', id: 'id' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Support message not found');
        return e;
    }
    async update(id: string, dto: UpdateSupportMessageDto) {
        throw new ConflictException('Support message o‘zgartirish mumkin emas');
    }
    async remove(id: string) {
        throw new ConflictException('Support message o‘chirish mumkin emas');
    }
}
