import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateInsuranceProviderDto } from './dto/create-insurance_provider.dto';
import { UpdateInsuranceProviderDto } from './dto/update-insurance_provider.dto';
import { InsuranceProvider } from './entities/insurance_provider.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class InsuranceProvidersService {
    constructor(
    @InjectRepository(InsuranceProvider)
    private readonly repo: Repository<InsuranceProvider>, private readonly dataSource: DataSource) { }
    async create(dto: CreateInsuranceProviderDto) {
        return this.dataSource.transaction(async (manager) => {
            const exists = await manager.findOne(InsuranceProvider, { where: { name: dto.name } });
            if (exists)
                throw new ConflictException('Provider name already exists');
            if (!dto.name || dto.name.trim().length < 2) {
                throw new BadRequestException('Provider name required and must be valid');
            }
            if (dto.contact_email && !dto.contact_email.includes('@')) {
                throw new BadRequestException('Contact email must be valid');
            }
            if (dto.contact_phone && dto.contact_phone.length < 5) {
                throw new BadRequestException('Contact phone must be valid');
            }
            const entity = manager.create(InsuranceProvider, dto as Partial<InsuranceProvider>);
            return await manager.save(entity);
        });
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('p').skip(skip).take(take);
        applySorting(qb, 'p', { default: 'id', id: 'id', name: 'name' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Insurance provider not found');
        return e;
    }
    async update(id: string, dto: UpdateInsuranceProviderDto) {
        return this.dataSource.transaction(async (manager) => {
            const provider = await manager.findOne(InsuranceProvider, { where: { id } });
            if (!provider)
                throw new NotFoundException('Insurance provider not found');
            if (dto.name) {
                const exists = await manager.findOne(InsuranceProvider, { where: { name: dto.name } });
                if (exists && exists.id !== id)
                    throw new ConflictException('Provider name already exists');
            }
            if (dto.name && dto.name.trim().length < 2) {
                throw new BadRequestException('Provider name required and must be valid');
            }
            if (dto.contact_email && !dto.contact_email.includes('@')) {
                throw new BadRequestException('Contact email must be valid');
            }
            if (dto.contact_phone && dto.contact_phone.length < 5) {
                throw new BadRequestException('Contact phone must be valid');
            }
            await manager.update(InsuranceProvider, { id }, dto as Partial<InsuranceProvider>);
            return this.findOne(id);
        });
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Insurance provider not found');
        return { success: true };
    }
}
