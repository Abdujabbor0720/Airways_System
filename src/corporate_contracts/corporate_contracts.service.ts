import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCorporateContractDto } from './dto/create-corporate_contract.dto';
import { UpdateCorporateContractDto } from './dto/update-corporate_contract.dto';
import { CorporateContract } from './entities/corporate_contract.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
import { Partner } from '../partners/entities/partner.entity';
import { Booking } from '../bookings/entities/booking.entity';
@Injectable()
export class CorporateContractsService {
    constructor(
    @InjectRepository(CorporateContract)
    private readonly repo: Repository<CorporateContract>, 
    @InjectRepository(Partner)
    private readonly partnerRepo: Repository<Partner>, 
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>, private readonly dataSource: DataSource) { }
    async create(dto: CreateCorporateContractDto) {
        return this.dataSource.transaction(async (manager) => {
            const exists = await manager.findOne(CorporateContract, { where: { company_name: dto.company_name } });
            if (exists)
                throw new ConflictException('Company already has a contract');
            if (dto.valid_from && dto.valid_to && new Date(dto.valid_from) >= new Date(dto.valid_to)) {
                throw new BadRequestException('valid_from valid_to dan kichik bo‘lishi kerak');
            }
            const entity = manager.create(CorporateContract, dto as Partial<CorporateContract>);
            return await manager.save(entity);
        });
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('c').skip(skip).take(take);
        applySorting(qb, 'c', { default: 'id', id: 'id', created_at: 'created_at', valid_from: 'valid_from', valid_to: 'valid_to' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Corporate contract not found');
        return e;
    }
    async update(id: string, dto: UpdateCorporateContractDto) {
        return this.dataSource.transaction(async (manager) => {
            const contract = await manager.findOne(CorporateContract, { where: { id } });
            if (!contract)
                throw new NotFoundException('Corporate contract not found');
            if (dto.company_name) {
                const exists = await manager.findOne(CorporateContract, { where: { company_name: dto.company_name } });
                if (exists && exists.id !== id)
                    throw new ConflictException('Company already has a contract');
            }
            if (dto.valid_from && dto.valid_to && new Date(dto.valid_from) >= new Date(dto.valid_to)) {
                throw new BadRequestException('valid_from valid_to dan kichik bo‘lishi kerak');
            }
            await manager.update(CorporateContract, { id }, dto as Partial<CorporateContract>);
            return this.findOne(id);
        });
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Corporate contract not found');
        return { success: true };
    }
}
