import { Injectable, ForbiddenException, NotFoundException, BadRequestException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateAdminActivityLogDto } from './dto/create-admin_activity_log.dto';
import { AdminActivityLog } from './entities/admin_activity_log.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class AdminActivityLogsService {
    constructor(
    @InjectRepository(AdminActivityLog)
    private readonly repo: Repository<AdminActivityLog>, private readonly dataSource: DataSource) { }
    async create(dto: CreateAdminActivityLogDto): Promise<AdminActivityLog> {
        if (!dto.action || !dto.entity_type) {
            throw new BadRequestException('Action va entity_type majburiy');
        }
        return await this.dataSource.transaction(async (manager) => {
            const log = manager.create(AdminActivityLog, {
                admin_user_id: dto.admin_user_id ?? null,
                action: dto.action,
                entity_type: dto.entity_type,
                entity_id: dto.entity_id ?? null,
                details: dto.details ?? null,
                ip: dto.ip ?? null,
            });
            return await manager.save(AdminActivityLog, log);
        });
    }
    async findAll(page: PaginationDto): Promise<{
        data: AdminActivityLog[];
        count: number;
    }> {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('a').skip(skip).take(take);
        applySorting(qb, 'a', { default: 'created_at', created_at: 'created_at', id: 'id', action: 'action' }, page.sort, page.order);
        const [data, count] = await qb.getManyAndCount();
        return { data, count };
    }
    async findOne(id: string): Promise<AdminActivityLog> {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Activity log not found');
        return e;
    }
    async update(): Promise<never> {
        throw new ForbiddenException('Activity logs are immutable and cannot be updated');
    }
    async remove(): Promise<never> {
        throw new ForbiddenException('Activity logs are immutable and cannot be deleted');
    }
}
