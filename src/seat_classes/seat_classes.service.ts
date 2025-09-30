import { Injectable, NotFoundException, BadRequestException, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REDIS } from '../common/redis/redis.module';
import type { Redis } from 'ioredis';
import { CreateSeatClassDto } from './dto/create-seat_class.dto';
import { UpdateSeatClassDto } from './dto/update-seat_class.dto';
import { SeatClass } from './entities/seat_class.entity';
@Injectable()
export class SeatClassesService {
    constructor(
    @InjectRepository(SeatClass)
    private readonly repo: Repository<SeatClass>,
    @Inject(REDIS) private readonly redis: Redis,
    ) { }
    async create(dto: CreateSeatClassDto) {
        if (!dto.code || !dto.display_name) {
            throw new BadRequestException('code va display_name majburiy');
        }
        const exists = await this.repo.findOne({ where: { code: dto.code } });
        if (exists) {
            throw new ConflictException('Bu code allaqachon mavjud');
        }
        let seatClass: SeatClass;
        await this.repo.manager.transaction(async (manager) => {
            seatClass = manager.create(SeatClass, dto);
            seatClass = await manager.save(seatClass);
        });
        return seatClass!;
    }
    async findAll(skip = 0, take = 20) {
        const cacheKey = `seat_classes:list:limit:${Math.min(take, 100)}:offset:${skip}`;
        try {
            const cached = await this.redis.get(cacheKey);
            if (cached) return JSON.parse(cached);
        } catch {}
        const res = await this.repo.findAndCount({ order: { code: 'ASC' }, skip, take: Math.min(take, 100) });
        try { await this.redis.set(cacheKey, JSON.stringify(res), 'EX', 300); } catch {}
        return res as any;
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Seat class not found');
        return e;
    }
    async update(id: string, dto: UpdateSeatClassDto) {
        const seatClass = await this.findOne(id);
        if (!seatClass)
            throw new NotFoundException('Seat class not found');
        if (dto.code && dto.code !== seatClass.code) {
            const exists = await this.repo.findOne({ where: { code: dto.code } });
            if (exists)
                throw new ConflictException('Bu code allaqachon mavjud');
        }
        let updated: SeatClass;
        await this.repo.manager.transaction(async (manager) => {
            await manager.update(SeatClass, { id }, dto as Partial<SeatClass>);
            const found = await manager.findOne(SeatClass, { where: { id } });
            if (!found) {
                throw new NotFoundException('Updated seat class not found');
            }
            updated = found;
        });
        this.invalidateCache().catch(() => {});
        return updated!;
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Seat class not found');
        this.invalidateCache().catch(() => {});
        return { success: true };
    }
    private async invalidateCache() {
        try {
            const keys = await this.redis.keys('seat_classes:*');
            if (keys?.length) await this.redis.del(keys);
        } catch {}
    }
}
