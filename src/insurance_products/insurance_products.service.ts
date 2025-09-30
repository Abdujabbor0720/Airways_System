import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateInsuranceProductDto } from './dto/create-insurance_product.dto';
import { UpdateInsuranceProductDto } from './dto/update-insurance_product.dto';
import { InsuranceProduct } from './entities/insurance_product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class InsuranceProductsService {
    constructor(
    @InjectRepository(InsuranceProduct)
    private readonly repo: Repository<InsuranceProduct>, private readonly dataSource: DataSource) { }
    async create(dto: CreateInsuranceProductDto) {
        return this.dataSource.transaction(async (manager) => {
            const exists = await manager.findOne(InsuranceProduct, {
                where: { provider_id: dto.provider_id, name: dto.name },
            });
            if (exists)
                throw new ConflictException('Product name already exists for this provider');
            if (!dto.coverage_details || dto.coverage_details.trim().length < 5) {
                throw new BadRequestException('Coverage details required and must be meaningful');
            }
            if (!dto.price || isNaN(Number(dto.price)) || Number(dto.price) <= 0) {
                throw new BadRequestException('Price must be a positive number');
            }
            if (!dto.currency || dto.currency.length !== 3) {
                throw new BadRequestException('Currency must be a 3-letter code');
            }
            const entity = manager.create(InsuranceProduct, dto as Partial<InsuranceProduct>);
            return await manager.save(entity);
        });
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('p').skip(skip).take(take);
        applySorting(qb, 'p', { default: 'id', id: 'id', name: 'name', price: 'price' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Insurance product not found');
        return e;
    }
    async update(id: string, dto: UpdateInsuranceProductDto) {
        return this.dataSource.transaction(async (manager) => {
            const product = await manager.findOne(InsuranceProduct, { where: { id } });
            if (!product)
                throw new NotFoundException('Insurance product not found');
            if (dto.provider_id && dto.name) {
                const exists = await manager.findOne(InsuranceProduct, {
                    where: { provider_id: dto.provider_id, name: dto.name },
                });
                if (exists && exists.id !== id)
                    throw new ConflictException('Product name already exists for this provider');
            }
            if (dto.coverage_details && dto.coverage_details.trim().length < 5) {
                throw new BadRequestException('Coverage details required and must be meaningful');
            }
            if (dto.price && (isNaN(Number(dto.price)) || Number(dto.price) <= 0)) {
                throw new BadRequestException('Price must be a positive number');
            }
            if (dto.currency && dto.currency.length !== 3) {
                throw new BadRequestException('Currency must be a 3-letter code');
            }
            await manager.update(InsuranceProduct, { id }, dto as Partial<InsuranceProduct>);
            return this.findOne(id);
        });
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Insurance product not found');
        return { success: true };
    }
}
