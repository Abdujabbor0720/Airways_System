import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserSearchHistoryDto } from './dto/create-user_search_history.dto';
import { UpdateUserSearchHistoryDto } from './dto/update-user_search_history.dto';
import { UserSearchHistory } from './entities/user_search_history.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class UserSearchHistoryService {
    constructor(
    @InjectRepository(UserSearchHistory)
    private readonly repo: Repository<UserSearchHistory>) { }
    async create(dto: CreateUserSearchHistoryDto) {
        if (!dto.origin_airport_id || !dto.destination_airport_id || !dto.depart_date) {
            throw new BadRequestException('origin_airport_id, destination_airport_id, depart_date majburiy');
        }
        if (dto.adults !== undefined && dto.adults < 1)
            throw new BadRequestException('Kamida 1 adult bo‘lishi kerak');
        if (dto.children !== undefined && dto.children < 0)
            throw new BadRequestException('children manfiy bo‘lmasligi kerak');
        if (dto.infants !== undefined && dto.infants < 0)
            throw new BadRequestException('infants manfiy bo‘lmasligi kerak');
        const exists = await this.repo.findOne({
            where: {
                user_id: dto.user_id ?? undefined,
                origin_airport_id: dto.origin_airport_id ?? undefined,
                destination_airport_id: dto.destination_airport_id,
                depart_date: dto.depart_date,
                return_date: dto.return_date ?? undefined,
                cabin_class_id: dto.cabin_class_id ?? undefined,
            }
        });
        if (exists)
            return exists;
        let entity: UserSearchHistory;
        await this.repo.manager.transaction(async (manager) => {
            entity = manager.create(UserSearchHistory, dto);
            entity = await manager.save(entity);
        });
        return entity!;
    }
    async findAll(page: PaginationDto, userId?: string) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('h').skip(skip).take(take);
        if (userId)
            qb.andWhere('h.user_id = :userId', { userId });
        applySorting(qb, 'h', { default: 'created_at', created_at: 'created_at', id: 'id' }, page.sort, page.order);
        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }
    async findOne(id: string) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('History not found');
        return entity;
    }
    async update(id: string, dto: UpdateUserSearchHistoryDto) {
        if (dto.origin_airport_id && !dto.destination_airport_id)
            throw new BadRequestException('destination_airport_id majburiy');
        if (dto.adults !== undefined && dto.adults < 1)
            throw new BadRequestException('Kamida 1 adult bo‘lishi kerak');
        if (dto.children !== undefined && dto.children < 0)
            throw new BadRequestException('children manfiy bo‘lmasligi kerak');
        if (dto.infants !== undefined && dto.infants < 0)
            throw new BadRequestException('infants manfiy bo‘lmasligi kerak');
        const current = await this.findOne(id);
        if (!current)
            throw new NotFoundException('History not found');
        const exists = await this.repo.findOne({
            where: {
                user_id: dto.user_id ?? current.user_id ?? undefined,
                origin_airport_id: dto.origin_airport_id ?? current.origin_airport_id ?? undefined,
                destination_airport_id: dto.destination_airport_id ?? current.destination_airport_id ?? undefined,
                depart_date: dto.depart_date ?? current.depart_date,
                return_date: dto.return_date ?? current.return_date ?? undefined,
                cabin_class_id: dto.cabin_class_id ?? current.cabin_class_id ?? undefined,
            }
        });
        if (exists && exists.id !== id)
            throw new ConflictException('Bu parametrlar uchun yozuv allaqachon mavjud');
        let updated: UserSearchHistory;
        await this.repo.manager.transaction(async (manager) => {
            await manager.update(UserSearchHistory, { id }, dto as Partial<UserSearchHistory>);
            const found = await manager.findOne(UserSearchHistory, { where: { id } });
            if (!found)
                throw new NotFoundException('History not found');
            updated = found;
        });
        return updated!;
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('History not found');
        return { success: true };
    }
}
