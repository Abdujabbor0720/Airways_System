import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlaneDto } from './dto/create-plane.dto';
import { UpdatePlaneDto } from './dto/update-plane.dto';
import { Plane } from './entities/plane.entity';
@Injectable()
export class PlanesService {
    constructor(
    @InjectRepository(Plane)
    private readonly repo: Repository<Plane>) { }
    async create(dto: CreatePlaneDto) {
        if (!dto.airline_id || !dto.airplane_model_id || !dto.tail_number) {
            throw new BadRequestException('airline_id, airplane_model_id va tail_number majburiy');
        }
        const exists = await this.repo.findOne({ where: { tail_number: dto.tail_number } });
        if (exists) {
            throw new ConflictException('Bu tail_number allaqachon mavjud');
        }
        let plane: Plane;
        await this.repo.manager.transaction(async (manager) => {
            plane = manager.create(Plane, dto);
            plane = await manager.save(plane);
        });
        return plane!;
    }
    findAll(skip = 0, take = 20) {
        return this.repo.findAndCount({ order: { id: 'ASC' }, skip, take });
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Plane not found');
        return e;
    }
    async update(id: string, dto: UpdatePlaneDto) {
        const plane = await this.findOne(id);
        if (!plane)
            throw new NotFoundException('Plane not found');
        if (dto.tail_number && dto.tail_number !== plane.tail_number) {
            const exists = await this.repo.findOne({ where: { tail_number: dto.tail_number } });
            if (exists)
                throw new ConflictException('Bu tail_number allaqachon mavjud');
        }
        let updated: Plane;
        await this.repo.manager.transaction(async (manager) => {
            await manager.update(Plane, { id }, dto as Partial<Plane>);
            const found = await manager.findOne(Plane, { where: { id } });
            if (!found)
                throw new NotFoundException('Updated plane not found');
            updated = found;
        });
        return updated!;
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Plane not found');
        return { success: true };
    }
}
