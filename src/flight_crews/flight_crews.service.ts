import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateFlightCrewDto } from './dto/create-flight_crew.dto';
import { UpdateFlightCrewDto } from './dto/update-flight_crew.dto';
import { FlightCrew } from './entities/flight_crew.entity';
@Injectable()
export class FlightCrewsService {
    constructor(
    @InjectRepository(FlightCrew)
    private readonly repo: Repository<FlightCrew>, private readonly dataSource: DataSource) { }
    async create(dto: CreateFlightCrewDto) {
        return this.dataSource.transaction(async (manager) => {
            const exists = await manager.findOne(FlightCrew, {
                where: { flight_instance_id: dto.flight_instance_id, crew_member_id: dto.crew_member_id },
            });
            if (exists)
                throw new ConflictException('Crew member already assigned to this flight');
            if (!dto.duty_role || dto.duty_role.trim().length < 2) {
                throw new BadRequestException('Duty role is required and must be valid');
            }
            const entity = manager.create(FlightCrew, dto as Partial<FlightCrew>);
            return await manager.save(entity);
        });
    }
    findAll(skip = 0, take = 20) {
        return this.repo.findAndCount({ order: { id: 'DESC' }, skip, take });
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Flight crew not found');
        return e;
    }
    async update(id: string, dto: UpdateFlightCrewDto) {
        return this.dataSource.transaction(async (manager) => {
            const crew = await manager.findOne(FlightCrew, { where: { id } });
            if (!crew)
                throw new NotFoundException('Flight crew not found');
            if (dto.flight_instance_id && dto.crew_member_id) {
                const exists = await manager.findOne(FlightCrew, {
                    where: { flight_instance_id: dto.flight_instance_id, crew_member_id: dto.crew_member_id },
                });
                if (exists && exists.id !== id)
                    throw new ConflictException('Crew member already assigned to this flight');
            }
            if (dto.duty_role && dto.duty_role.trim().length < 2) {
                throw new BadRequestException('Duty role is required and must be valid');
            }
            await manager.update(FlightCrew, { id }, dto as Partial<FlightCrew>);
            return this.findOne(id);
        });
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Flight crew not found');
        return { success: true };
    }
}
