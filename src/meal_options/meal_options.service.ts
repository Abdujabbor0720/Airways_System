import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateMealOptionDto } from './dto/create-meal_option.dto';
import { UpdateMealOptionDto } from './dto/update-meal_option.dto';
import { MealOption } from './entities/meal_option.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class MealOptionsService {
    constructor(
    @InjectRepository(MealOption)
    private readonly repo: Repository<MealOption>, private readonly dataSource: DataSource) { }
    async create(dto: CreateMealOptionDto) {
        return this.dataSource.transaction(async (manager) => {
            const exists = await manager.findOne(MealOption, { where: { code: dto.code } });
            if (exists)
                throw new ConflictException('Meal code already exists');
            if (!dto.description || dto.description.trim().length < 2) {
                throw new BadRequestException('Description required and must be valid');
            }
            const entity = manager.create(MealOption, dto as Partial<MealOption>);
            return await manager.save(entity);
        });
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 50, 200);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('m').skip(skip).take(take);
        applySorting(qb, 'm', { default: 'code', code: 'code', id: 'id' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Meal option not found');
        return e;
    }
    async update(id: string, dto: UpdateMealOptionDto) {
        return this.dataSource.transaction(async (manager) => {
            const meal = await manager.findOne(MealOption, { where: { id } });
            if (!meal)
                throw new NotFoundException('Meal option not found');
            if (dto.code) {
                const exists = await manager.findOne(MealOption, { where: { code: dto.code } });
                if (exists && exists.id !== id)
                    throw new ConflictException('Meal code already exists');
            }
            if (dto.description && dto.description.trim().length < 2) {
                throw new BadRequestException('Description required and must be valid');
            }
            await manager.update(MealOption, { id }, dto as Partial<MealOption>);
            return this.findOne(id);
        });
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Meal option not found');
        return { success: true };
    }
}
