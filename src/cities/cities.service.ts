import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
import { Country } from '../countries/entities/country.entity';
@Injectable()
export class CitiesService {
    constructor(
    @InjectRepository(City)
    private readonly repo: Repository<City>, 
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>, private readonly dataSource: DataSource) { }
    async create(createCityDto: CreateCityDto) {
        return this.dataSource.transaction(async (manager) => {
            const country = await manager.findOne(Country, { where: { id: createCityDto.country_id } });
            if (!country)
                throw new NotFoundException('Country not found');
            const exists = await manager.findOne(City, {
                where: { country_id: createCityDto.country_id, name: createCityDto.name },
            });
            if (exists)
                throw new ConflictException('City name already exists in this country');
            if (createCityDto.timezone && !/^([A-Za-z_]+\/){1,2}[A-Za-z_]+$/.test(createCityDto.timezone)) {
                throw new BadRequestException('Timezone format noto‘g‘ri');
            }
            const entity = manager.create(City, createCityDto);
            return await manager.save(entity);
        });
    }
    async findAll(page: PaginationDto, countryId?: string) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('c').skip(skip).take(take);
        if (countryId)
            qb.andWhere('c.country_id = :countryId', { countryId });
        applySorting(qb, 'c', { default: 'id', id: 'id', name: 'name', created_at: 'created_at' }, page.sort, page.order);
        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }
    async findOne(id: string) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('City not found');
        return entity;
    }
    async update(id: string, updateCityDto: UpdateCityDto) {
        return this.dataSource.transaction(async (manager) => {
            const city = await manager.findOne(City, { where: { id } });
            if (!city)
                throw new NotFoundException('City not found');
            if (updateCityDto.country_id) {
                const country = await manager.findOne(Country, { where: { id: updateCityDto.country_id } });
                if (!country)
                    throw new NotFoundException('Country not found');
            }
            if (updateCityDto.name) {
                const exists = await manager.findOne(City, {
                    where: { country_id: updateCityDto.country_id ?? city.country_id, name: updateCityDto.name },
                });
                if (exists && exists.id !== id)
                    throw new ConflictException('City name already exists in this country');
            }
            if (updateCityDto.timezone && !/^([A-Za-z_]+\/){1,2}[A-Za-z_]+$/.test(updateCityDto.timezone)) {
                throw new BadRequestException('Timezone format noto‘g‘ri');
            }
            await manager.update(City, { id }, updateCityDto);
            return this.findOne(id);
        });
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('City not found');
        return { success: true };
    }
}
