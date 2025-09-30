import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePartnerPointTransactionDto } from './dto/create-partner_point_transaction.dto';
import { UpdatePartnerPointTransactionDto } from './dto/update-partner_point_transaction.dto';
import { PartnerPointTransaction } from './entities/partner_point_transaction.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class PartnerPointTransactionsService {
    constructor(
    @InjectRepository(PartnerPointTransaction)
    private readonly repo: Repository<PartnerPointTransaction>) { }
    async create(dto: CreatePartnerPointTransactionDto) {
        if (!dto.partner_id || !dto.user_id) {
            throw new BadRequestException('partner_id va user_id majburiy');
        }
        if (typeof dto.points_delta !== 'number' || dto.points_delta === 0) {
            throw new BadRequestException('points_delta 0 bo‘lmasligi kerak');
        }
        let tx: PartnerPointTransaction;
        await this.repo.manager.transaction(async (manager) => {
            tx = manager.create(PartnerPointTransaction, dto);
            tx = await manager.save(tx);
        });
        return tx!;
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('t').skip(skip).take(take);
        applySorting(qb, 't', { default: 'id', id: 'id', created_at: 'created_at', points_delta: 'points_delta' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Partner transaction not found');
        return e;
    }
    async update(id: string, dto: UpdatePartnerPointTransactionDto) {
        throw new ConflictException('Point transaction o‘zgartirib bo‘lmaydi');
    }
    async remove(id: string) {
        throw new ConflictException('Point transaction o‘chirish mumkin emas');
    }
}
