import { Injectable, NotFoundException, BadRequestException, ConflictException, Inject, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { Airport } from './entities/airport.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
import { REDIS } from '../common/redis/redis.module';
import type { Redis } from 'ioredis';
@Injectable()
export class AirportsService {
    constructor(
    @InjectRepository(Airport)
    private readonly repo: Repository<Airport>, private readonly dataSource: DataSource,
    @Inject(REDIS) private readonly redis: Redis,
    ) { }
    async create(dto: CreateAirportDto): Promise<Airport> {
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
            const airport = manager.create(Airport, {
                ...dto,
                iata_code: dto.iata_code ? dto.iata_code.toUpperCase() : null,
                icao_code: dto.icao_code ? dto.icao_code.toUpperCase() : null,
            });
            return await manager.save(Airport, airport);
        });
        this.invalidateCache().catch(() => {});
        return created;
    }
    async findAll(page: PaginationDto, cityId?: string): Promise<{ items: Airport[]; total: number }> {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? ((Math.max((page.page ?? 1), 1) - 1) * take);
        const sort = page.sort ?? 'id';
        const order = page.order ?? 'ASC';
        const cacheKey = `airports:list:city:${cityId ?? 'all'}:limit:${take}:offset:${skip}:sort:${sort}:order:${order}`;
        try {
            const cached = await this.redis.get(cacheKey);
            if (cached) return JSON.parse(cached);
        } catch {}
        const qb = this.repo.createQueryBuilder('a').skip(skip).take(take);
        if (cityId)
            qb.andWhere('a.city_id = :cityId', { cityId });
        applySorting(qb, 'a', { default: 'id', id: 'id', name: 'name', iata_code: 'iata_code', icao_code: 'icao_code', created_at: 'created_at' }, page.sort, page.order);
        const [items, total] = await qb.getManyAndCount();
        const payload = { items, total };
        try { await this.redis.set(cacheKey, JSON.stringify(payload), 'EX', 120); } catch {}
        return payload;
    }
    async findOne(id: string): Promise<Airport> {
        const airport = await this.repo.findOne({ where: { id } });
        if (!airport)
            throw new NotFoundException('Airport not found');
        return airport;
    }
    async search(iata?: string, icao?: string): Promise<Airport[]> {
        if (!iata && !icao)
            return [];
        if (iata)
            return await this.repo.find({ where: { iata_code: iata.toUpperCase() } });
        return await this.repo.find({ where: { icao_code: (icao ?? '').toUpperCase() } });
    }
    async update(id: string, dto: UpdateAirportDto): Promise<Airport> {
        const airport = await this.repo.findOne({ where: { id } });
        if (!airport)
            throw new NotFoundException('Airport not found');
        if (dto.iata_code && dto.iata_code.toUpperCase() !== airport.iata_code) {
            const exists = await this.repo.findOne({ where: { iata_code: dto.iata_code.toUpperCase() } });
            if (exists && exists.id !== id)
                throw new ConflictException('IATA code already exists');
        }
        if (dto.icao_code && dto.icao_code.toUpperCase() !== airport.icao_code) {
            const exists = await this.repo.findOne({ where: { icao_code: dto.icao_code.toUpperCase() } });
            if (exists && exists.id !== id)
                throw new ConflictException('ICAO code already exists');
        }
        const updated = await this.dataSource.transaction(async (manager) => {
            manager.merge(Airport, airport, {
                ...dto,
                iata_code: dto.iata_code ? dto.iata_code.toUpperCase() : airport.iata_code,
                icao_code: dto.icao_code ? dto.icao_code.toUpperCase() : airport.icao_code,
            });
            return await manager.save(Airport, airport);
        });
        this.invalidateCache().catch(() => {});
        return updated;
    }
    async remove(id: string): Promise<{
        success: boolean;
    }> {
        const airport = await this.repo.findOne({ where: { id } });
        if (!airport)
            throw new NotFoundException('Airport not found');
        await this.dataSource.transaction(async (manager) => {
            await manager.delete(Airport, { id });
        });
        this.invalidateCache().catch(() => {});
        return { success: true };
    }
    private async invalidateCache() {
        try {
            const keys = await this.redis.keys('airports:*');
            if (keys?.length) await this.redis.del(keys);
        } catch {}
    }
}
