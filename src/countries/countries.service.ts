import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
import { City } from '../cities/entities/city.entity';
import { Airport } from '../airports/entities/airport.entity';
@Injectable()
export class CountriesService {
    constructor(
    @InjectRepository(Country)
    private readonly repo: Repository<Country>, 
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>, 
    @InjectRepository(Airport)
    private readonly airportRepo: Repository<Airport>, private readonly dataSource: DataSource) { }
    async create(createCountryDto: CreateCountryDto) {
        return this.dataSource.transaction(async (manager) => {
            const existsIso2 = await manager.findOne(Country, { where: { iso2: createCountryDto.iso2 } });
            if (existsIso2)
                throw new ConflictException('ISO2 code already exists');
            if (createCountryDto.iso3) {
                const existsIso3 = await manager.findOne(Country, { where: { iso3: createCountryDto.iso3 } });
                if (existsIso3)
                    throw new ConflictException('ISO3 code already exists');
            }
            if (!createCountryDto.name || createCountryDto.name.trim().length < 2) {
                throw new BadRequestException('Country name is required');
            }
            const entity = manager.create(Country, createCountryDto);
            return await manager.save(entity);
        });
    }
    async findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('c').skip(skip).take(take);
        applySorting(qb, 'c', { default: 'id', id: 'id', name: 'name', iso2: 'iso2', iso3: 'iso3', created_at: 'created_at' }, page.sort, page.order);
        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }
    async findOne(id: string) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('Country not found');
        return entity;
    }
    async update(id: string, updateCountryDto: UpdateCountryDto) {
        return this.dataSource.transaction(async (manager) => {
            const country = await manager.findOne(Country, { where: { id } });
            if (!country)
                throw new NotFoundException('Country not found');
            if (updateCountryDto.iso2) {
                const existsIso2 = await manager.findOne(Country, { where: { iso2: updateCountryDto.iso2 } });
                if (existsIso2 && existsIso2.id !== id)
                    throw new ConflictException('ISO2 code already exists');
            }
            if (updateCountryDto.iso3) {
                const existsIso3 = await manager.findOne(Country, { where: { iso3: updateCountryDto.iso3 } });
                if (existsIso3 && existsIso3.id !== id)
                    throw new ConflictException('ISO3 code already exists');
            }
            if (updateCountryDto.name && updateCountryDto.name.trim().length < 2) {
                throw new BadRequestException('Country name is required');
            }
            await manager.update(Country, { id }, updateCountryDto);
            return this.findOne(id);
        });
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Country not found');
        return { success: true };
    }
}
