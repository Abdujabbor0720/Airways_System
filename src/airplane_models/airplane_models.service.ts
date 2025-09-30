import { Injectable, NotFoundException, BadRequestException, ConflictException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateAirplaneModelDto } from './dto/create-airplane_model.dto';
import { UpdateAirplaneModelDto } from './dto/update-airplane_model.dto';
import { AirplaneModel } from './entities/airplane_model.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class AirplaneModelsService {
    constructor(
    @InjectRepository(AirplaneModel)
    private readonly repo: Repository<AirplaneModel>, private readonly dataSource: DataSource) { }
    async create(dto: CreateAirplaneModelDto): Promise<AirplaneModel> {
        const exists = await this.repo.findOne({ where: { manufacturer: dto.manufacturer, model: dto.model } });
        if (exists)
            throw new ConflictException('Manufacturer-model combination already exists');
        return await this.dataSource.transaction(async (manager) => {
            const airplaneModel = manager.create(AirplaneModel, {
                ...dto,
            });
            return await manager.save(AirplaneModel, airplaneModel);
        });
    }
    async findAll(page: PaginationDto): Promise<{
        data: AirplaneModel[];
        count: number;
    }> {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('m').skip(skip).take(take);
        applySorting(qb, 'm', { default: 'manufacturer', manufacturer: 'manufacturer', model: 'model', created_at: 'created_at' }, page.sort, page.order);
        const [data, count] = await qb.getManyAndCount();
        return { data, count };
    }
    async findOne(id: string): Promise<AirplaneModel> {
        const airplaneModel = await this.repo.findOne({ where: { id } });
        if (!airplaneModel)
            throw new NotFoundException('Airplane model not found');
        return airplaneModel;
    }
    async update(id: string, dto: UpdateAirplaneModelDto): Promise<AirplaneModel> {
        const airplaneModel = await this.repo.findOne({ where: { id } });
        if (!airplaneModel)
            throw new NotFoundException('Airplane model not found');
        if (dto.manufacturer && dto.model && (dto.manufacturer !== airplaneModel.manufacturer || dto.model !== airplaneModel.model)) {
            const exists = await this.repo.findOne({ where: { manufacturer: dto.manufacturer, model: dto.model } });
            if (exists && exists.id !== id)
                throw new ConflictException('Manufacturer-model combination already exists');
        }
        return await this.dataSource.transaction(async (manager) => {
            manager.merge(AirplaneModel, airplaneModel, {
                ...dto,
            });
            return await manager.save(AirplaneModel, airplaneModel);
        });
    }
    async remove(id: string): Promise<{
        success: boolean;
    }> {
        const airplaneModel = await this.repo.findOne({ where: { id } });
        if (!airplaneModel)
            throw new NotFoundException('Airplane model not found');
        await this.dataSource.transaction(async (manager) => {
            await manager.delete(AirplaneModel, { id });
        });
        return { success: true };
    }
}
