import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { Flight } from './entities/flight.entity';
import { FlightInstance } from '../flight_instances/entities/flight_instance.entity';
import { Airport } from '../airports/entities/airport.entity';
import { UserSearchHistoryService } from '../user_search_history/user_search_history.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
import { REDIS } from '../common/redis/redis.module';
import type { Redis } from 'ioredis';
@Injectable()
export class FlightsService {
    constructor(
    @InjectRepository(Flight)
    private readonly flightRepo: Repository<Flight>, 
    @InjectRepository(FlightInstance)
    private readonly fiRepo: Repository<FlightInstance>, 
    @InjectRepository(Airport)
    private readonly airportRepo: Repository<Airport>, private readonly history: UserSearchHistoryService, private readonly dataSource: DataSource,
    @Inject(REDIS) private readonly redis: Redis,
    ) { }
    async create(createFlightDto: CreateFlightDto) {
        const created = await this.dataSource.transaction(async (manager) => {
            const exists = await manager.findOne(Flight, {
                where: {
                    airline_id: createFlightDto.airline_id,
                    flight_number: createFlightDto.flight_number,
                    from_airport_id: createFlightDto.from_airport_id,
                    to_airport_id: createFlightDto.to_airport_id,
                },
            });
            if (exists)
                throw new ConflictException('Flight route already exists for this airline and flight number');
            const fromAirport = await manager.findOne(Airport, { where: { id: createFlightDto.from_airport_id } });
            const toAirport = await manager.findOne(Airport, { where: { id: createFlightDto.to_airport_id } });
            if (!fromAirport || !toAirport)
                throw new BadRequestException('Invalid airport IDs');
            if (createFlightDto.scheduled_duration_minutes && createFlightDto.scheduled_duration_minutes <= 0) {
                throw new BadRequestException('Scheduled duration must be positive');
            }
            const entity = manager.create(Flight, createFlightDto as Partial<Flight>);
            return await manager.save(entity);
        });
        this.invalidateCache().catch(() => {});
        return created;
    }
    async findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? ((Math.max((page.page ?? 1), 1) - 1) * take);
        const sort = page.sort ?? 'id';
        const order = page.order ?? 'ASC';
        const cacheKey = `flights:list:limit:${take}:offset:${skip}:sort:${sort}:order:${order}`;
        try {
            const cached = await this.redis.get(cacheKey);
            if (cached) return JSON.parse(cached);
        } catch {}
        const qb = this.flightRepo.createQueryBuilder('f').skip(skip).take(take);
        applySorting(qb, 'f', { default: 'id', id: 'id', flight_number: 'flight_number', created_at: 'created_at' }, page.sort, page.order);
        const [items, total] = await qb.getManyAndCount();
        const payload = { items, total };
        try { await this.redis.set(cacheKey, JSON.stringify(payload), 'EX', 60); } catch {}
        return payload;
    }
    async findOne(id: string) {
        const entity = await this.flightRepo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('Flight not found');
        return entity;
    }
    async update(id: string, updateFlightDto: UpdateFlightDto) {
        const updated = await this.dataSource.transaction(async (manager) => {
            const flight = await manager.findOne(Flight, { where: { id } });
            if (!flight)
                throw new NotFoundException('Flight not found');
            if (updateFlightDto.airline_id && updateFlightDto.flight_number && updateFlightDto.from_airport_id && updateFlightDto.to_airport_id) {
                const exists = await manager.findOne(Flight, {
                    where: {
                        airline_id: updateFlightDto.airline_id,
                        flight_number: updateFlightDto.flight_number,
                        from_airport_id: updateFlightDto.from_airport_id,
                        to_airport_id: updateFlightDto.to_airport_id,
                    },
                });
                if (exists && exists.id !== id)
                    throw new ConflictException('Flight route already exists for this airline and flight number');
            }
            if (updateFlightDto.from_airport_id) {
                const fromAirport = await manager.findOne(Airport, { where: { id: updateFlightDto.from_airport_id } });
                if (!fromAirport)
                    throw new BadRequestException('Invalid from_airport_id');
            }
            if (updateFlightDto.to_airport_id) {
                const toAirport = await manager.findOne(Airport, { where: { id: updateFlightDto.to_airport_id } });
                if (!toAirport)
                    throw new BadRequestException('Invalid to_airport_id');
            }
            if (updateFlightDto.scheduled_duration_minutes && updateFlightDto.scheduled_duration_minutes <= 0) {
                throw new BadRequestException('Scheduled duration must be positive');
            }
            await manager.update(Flight, { id }, updateFlightDto as Partial<Flight>);
            return this.findOne(id);
        });
        this.invalidateCache().catch(() => {});
        return updated;
    }
    async remove(id: string) {
        const res = await this.flightRepo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Flight not found');
        this.invalidateCache().catch(() => {});
        return { success: true };
    }
    async search(params: {
        from: string;
        to: string;
        date: string;
        limit?: number;
        offset?: number;
        userId?: string;
        adults?: number;
        children?: number;
        infants?: number;
        cabinClassId?: string;
    }) {
        const { from, to, date } = params;
        const fromId = await this.resolveAirportId(from);
        const toId = await this.resolveAirportId(to);
        const start = new Date(`${date}T00:00:00.000Z`);
        const end = new Date(start.getTime() + 24 * 3600 * 1000);
        const take = Math.min(params.limit ?? 20, 100);
        const skip = params.offset ?? 0;
        const qb = this.fiRepo
            .createQueryBuilder('fi')
            .innerJoin(Flight, 'f', 'f.id = fi.flight_id')
            .where('f.from_airport_id = :fromId AND f.to_airport_id = :toId', { fromId, toId })
            .andWhere('fi.departure_scheduled >= :start AND fi.departure_scheduled < :end', { start, end })
            .orderBy('fi.departure_scheduled', 'ASC')
            .skip(skip)
            .take(take);
        const [items, total] = await qb.getManyAndCount();
        if (params.userId) {
            await this.history.create({
                user_id: params.userId,
                origin_airport_id: fromId,
                destination_airport_id: toId,
                depart_date: date,
                return_date: undefined,
                adults: params.adults ?? 1,
                children: params.children ?? 0,
                infants: params.infants ?? 0,
                cabin_class_id: params.cabinClassId,
            });
        }
        return { items, total, limit: take, offset: skip };
    }
    private async resolveAirportId(codeOrId: string): Promise<string> {
        if (/^\d+$/.test(codeOrId))
            return codeOrId;
        const s = codeOrId.toUpperCase();
        if (s.length === 3) {
            const a = await this.airportRepo.findOne({ where: { iata_code: s } });
            if (a)
                return a.id;
        }
        if (s.length === 4) {
            const a = await this.airportRepo.findOne({ where: { icao_code: s } });
            if (a)
                return a.id;
        }
        let a = await this.airportRepo.findOne({ where: { iata_code: s } });
        if (a)
            return a.id;
        a = await this.airportRepo.findOne({ where: { icao_code: s } });
        if (a)
            return a.id;
        throw new NotFoundException(`Airport not found: ${codeOrId}`);
    }
    private async invalidateCache() {
        try {
            const keys = await this.redis.keys('flights:list:*');
            if (keys?.length) await this.redis.del(keys);
        } catch {}
    }
}
