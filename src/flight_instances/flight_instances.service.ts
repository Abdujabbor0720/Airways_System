import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Between, Repository } from 'typeorm';
import { CreateFlightInstanceDto } from './dto/create-flight_instance.dto';
import { UpdateFlightInstanceDto } from './dto/update-flight_instance.dto';
import { FlightInstance } from './entities/flight_instance.entity';
@Injectable()
export class FlightInstancesService {
    constructor(
    @InjectRepository(FlightInstance)
    private readonly repo: Repository<FlightInstance>, private readonly dataSource: DataSource) { }
    async create(createFlightInstanceDto: CreateFlightInstanceDto) {
        return this.dataSource.transaction(async (manager) => {
            const exists = await manager.findOne(FlightInstance, {
                where: {
                    flight_id: createFlightInstanceDto.flight_id,
                    departure_scheduled: new Date(createFlightInstanceDto.departure_scheduled),
                },
            });
            if (exists)
                throw new ConflictException('Flight already scheduled for this departure time');
            const entity = manager.create(FlightInstance, {
                ...createFlightInstanceDto,
                status: 'SCHEDULED',
            } as unknown as Partial<FlightInstance>);
            return await manager.save(entity);
        });
    }
    findAll(skip = 0, take = 20) {
        return this.repo.findAndCount({ order: { departure_scheduled: 'ASC' }, skip, take });
    }
    async findOne(id: string) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('Flight instance not found');
        return entity;
    }
    async update(id: string, updateFlightInstanceDto: UpdateFlightInstanceDto) {
        return this.dataSource.transaction(async (manager) => {
            const fi = await manager.findOne(FlightInstance, { where: { id } });
            if (!fi)
                throw new NotFoundException('Flight instance not found');
            if (updateFlightInstanceDto.flight_id && updateFlightInstanceDto.departure_scheduled) {
                const exists = await manager.findOne(FlightInstance, {
                    where: {
                        flight_id: updateFlightInstanceDto.flight_id,
                        departure_scheduled: new Date(updateFlightInstanceDto.departure_scheduled),
                    },
                });
                if (exists && exists.id !== id)
                    throw new ConflictException('Flight already scheduled for this departure time');
            }
            if (updateFlightInstanceDto.status) {
                const allowed: Record<string, string[]> = {
                    SCHEDULED: ['DELAYED', 'CANCELLED', 'DEPARTED'],
                    DELAYED: ['CANCELLED', 'DEPARTED'],
                    CANCELLED: [],
                    DEPARTED: ['ARRIVED'],
                    ARRIVED: [],
                };
                if (fi.status === updateFlightInstanceDto.status)
                    return fi;
                const can = allowed[fi.status as keyof typeof allowed] ?? [];
                if (!can.includes(updateFlightInstanceDto.status))
                    throw new BadRequestException('Invalid status transition');
            }
            await manager.update(FlightInstance, { id }, updateFlightInstanceDto as Partial<FlightInstance>);
            return this.findOne(id);
        });
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Flight instance not found');
        return { success: true };
    }
    async listByFlightId(flightId: string, opts: {
        fromDate?: string;
        toDate?: string;
        limit?: number;
        offset?: number;
    }) {
        const { fromDate, toDate } = opts;
        const take = Math.min(opts.limit ?? 20, 100);
        const skip = opts.offset ?? 0;
        const qb = this.repo.createQueryBuilder('fi').where('fi.flight_id = :flightId', { flightId });
        if (fromDate)
            qb.andWhere('fi.departure_scheduled >= :from', { from: new Date(`${fromDate}T00:00:00.000Z`) });
        if (toDate)
            qb.andWhere('fi.departure_scheduled < :to', { to: new Date(`${toDate}T00:00:00.000Z`) });
        const [items, total] = await qb.orderBy('fi.departure_scheduled', 'ASC').skip(skip).take(take).getManyAndCount();
        return { items, total, limit: take, offset: skip };
    }
    async setStatus(id: string, status: 'SCHEDULED' | 'DELAYED' | 'CANCELLED' | 'DEPARTED' | 'ARRIVED') {
        const fi = await this.findOne(id);
        const allowed: Record<string, string[]> = {
            SCHEDULED: ['DELAYED', 'CANCELLED', 'DEPARTED'],
            DELAYED: ['CANCELLED', 'DEPARTED'],
            CANCELLED: [],
            DEPARTED: ['ARRIVED'],
            ARRIVED: [],
        };
        if (fi.status === status)
            return fi;
        const can = allowed[fi.status as keyof typeof allowed] ?? [];
        if (!can.includes(status))
            throw new BadRequestException('Invalid status transition');
        const patch: Partial<FlightInstance> = { status };
        if (status === 'DEPARTED' && !fi.departure_actual)
            patch.departure_actual = new Date();
        if (status === 'ARRIVED' && !fi.arrival_actual)
            patch.arrival_actual = new Date();
        await this.repo.update({ id }, patch);
        return this.findOne(id);
    }
}
