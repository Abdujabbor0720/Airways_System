import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCrewMemberDto } from './dto/create-crew_member.dto';
import { UpdateCrewMemberDto } from './dto/update-crew_member.dto';
import { CrewMember } from './entities/crew_member.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
import { Airline } from '../airlines/entities/airline.entity';
import { FlightCrew } from '../flight_crews/entities/flight_crew.entity';
@Injectable()
export class CrewMembersService {
    constructor(
    @InjectRepository(CrewMember)
    private readonly repo: Repository<CrewMember>, 
    @InjectRepository(Airline)
    private readonly airlineRepo: Repository<Airline>, 
    @InjectRepository(FlightCrew)
    private readonly flightCrewRepo: Repository<FlightCrew>, private readonly dataSource: DataSource) { }
    async create(dto: CreateCrewMemberDto) {
        return this.dataSource.transaction(async (manager) => {
            if (!dto.full_name || dto.full_name.trim().length < 2)
                throw new BadRequestException('Full name required');
            if (!dto.role)
                throw new BadRequestException('Role required');
            if (!dto.hire_date)
                throw new BadRequestException('Hire date required');
            if (!dto.identification_document)
                throw new BadRequestException('Identification document required');
            const exists = await manager.findOne(CrewMember, { where: { identification_document: dto.identification_document } });
            if (exists)
                throw new ConflictException('Identification document already exists');
            const entity = manager.create(CrewMember, dto as Partial<CrewMember>);
            return await manager.save(entity);
        });
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('c').skip(skip).take(take);
        applySorting(qb, 'c', { default: 'id', id: 'id', full_name: 'full_name', role: 'role', created_at: 'created_at' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Crew member not found');
        return e;
    }
    async update(id: string, dto: UpdateCrewMemberDto) {
        return this.dataSource.transaction(async (manager) => {
            const member = await manager.findOne(CrewMember, { where: { id } });
            if (!member)
                throw new NotFoundException('Crew member not found');
            if (dto.identification_document) {
                const exists = await manager.findOne(CrewMember, { where: { identification_document: dto.identification_document } });
                if (exists && exists.id !== id)
                    throw new ConflictException('Identification document already exists');
            }
            await manager.update(CrewMember, { id }, dto as Partial<CrewMember>);
            return this.findOne(id);
        });
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Crew member not found');
        return { success: true };
    }
}
