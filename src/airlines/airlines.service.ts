import { Injectable, NotFoundException, BadRequestException, ConflictException, Inject, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';
import { Airline } from './entities/airline.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
import { REDIS } from '../common/redis/redis.module';
import type { Redis } from 'ioredis';
@Injectable()
export class AirlinesService {
    constructor(
    @InjectRepository(Airline)
    private readonly repo: Repository<Airline>, private readonly dataSource: DataSource,
    @Inject(REDIS) private readonly redis: Redis,
    ) { }
    async create(dto: CreateAirlineDto): Promise<Airline> {
        if (dto.iata_code) {
            const exists = await this.repo.findOne({ where: { iata_code: dto.iata_code.toUpperCase() } });
            if (exists)
                throw new ConflictException('IATA code already exists');
        }
        if (dto.icao_code) {
            const exists = await this.repo.findOne({ where: { icao_code: dto.icao_code.toUpperCase() } });
            if (exists)
                throw new ConflictException('ICAO code already exists');
        }
        const created = await this.dataSource.transaction(async (manager) => {
            const airline = manager.create(Airline, {
                ...dto,
                iata_code: dto.iata_code ? dto.iata_code.toUpperCase() : null,
                icao_code: dto.icao_code ? dto.icao_code.toUpperCase() : null,
            });
            return await manager.save(Airline, airline);
        });
        this.invalidateCache().catch(() => {});
        return created;
    }
    async findAll(page: PaginationDto): Promise<{ items: Airline[]; total: number }> {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? ((Math.max((page.page ?? 1), 1) - 1) * take);
        const sort = page.sort ?? 'id';
        const order = page.order ?? 'ASC';
        const cacheKey = `airlines:list:limit:${take}:offset:${skip}:sort:${sort}:order:${order}`;
        try {
            const cached = await this.redis.get(cacheKey);
            if (cached) return JSON.parse(cached);
        } catch {}
        const qb = this.repo.createQueryBuilder('a').skip(skip).take(take);
        applySorting(qb, 'a', { default: 'id', id: 'id', name: 'name', iata_code: 'iata_code', icao_code: 'icao_code', created_at: 'created_at' }, page.sort, page.order);
        const [items, total] = await qb.getManyAndCount();
        const payload = { items, total };
        try { await this.redis.set(cacheKey, JSON.stringify(payload), 'EX', 60); } catch {}
        return payload;
    }
    async findOne(id: string): Promise<Airline> {
        const airline = await this.repo.findOne({ where: { id } });
        if (!airline)
            throw new NotFoundException('Airline not found');
        return airline;
    }
    async update(id: string, dto: UpdateAirlineDto): Promise<Airline> {
        const airline = await this.repo.findOne({ where: { id } });
        if (!airline)
            throw new NotFoundException('Airline not found');
        if (dto.iata_code && dto.iata_code.toUpperCase() !== airline.iata_code) {
            const exists = await this.repo.findOne({ where: { iata_code: dto.iata_code.toUpperCase() } });
            if (exists && exists.id !== id)
                throw new ConflictException('IATA code already exists');
        }
        if (dto.icao_code && dto.icao_code.toUpperCase() !== airline.icao_code) {
            const exists = await this.repo.findOne({ where: { icao_code: dto.icao_code.toUpperCase() } });
            if (exists && exists.id !== id)
                throw new ConflictException('ICAO code already exists');
        }
        const updated = await this.dataSource.transaction(async (manager) => {
            manager.merge(Airline, airline, {
                ...dto,
                iata_code: dto.iata_code ? dto.iata_code.toUpperCase() : airline.iata_code,
                icao_code: dto.icao_code ? dto.icao_code.toUpperCase() : airline.icao_code,
            });
            return await manager.save(Airline, airline);
        });
        this.invalidateCache().catch(() => {});
        return updated;
    }
    async remove(id: string): Promise<{
        success: boolean;
    }> {
        const airline = await this.repo.findOne({ where: { id } });
        if (!airline)
            throw new NotFoundException('Airline not found');
        await this.dataSource.transaction(async (manager) => {
            await manager.delete(Airline, { id });
        });
        this.invalidateCache().catch(() => {});
        return { success: true };
    }
    async findByIata(iata: string): Promise<Airline | null> {
        const key = `airlines:by:iata:${String(iata).toUpperCase()}`;
        try {
            const cached = await this.redis.get(key);
            if (cached) return JSON.parse(cached);
        } catch {}
        const res = await this.repo.findOne({ where: { iata_code: iata.toUpperCase() } });
        try { if (res) await this.redis.set(key, JSON.stringify(res), 'EX', 300); } catch {}
        return res;
    }
    async findByIcao(icao: string): Promise<Airline | null> {
        const key = `airlines:by:icao:${String(icao).toUpperCase()}`;
        try {
            const cached = await this.redis.get(key);
            if (cached) return JSON.parse(cached);
        } catch {}
        const res = await this.repo.findOne({ where: { icao_code: icao.toUpperCase() } });
        try { if (res) await this.redis.set(key, JSON.stringify(res), 'EX', 300); } catch {}
        return res;
    }
    private async invalidateCache() {
        try {
            const keys = await this.redis.keys('airlines:*');
            if (keys?.length) await this.redis.del(keys);
        } catch {}
    }
}
