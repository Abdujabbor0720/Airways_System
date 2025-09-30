import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner } from './entities/partner.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
import { PartnerPointTransaction } from '../partner_point_transactions/entities/partner_point_transaction.entity';
@Injectable()
export class PartnersService {
    constructor(
    @InjectRepository(Partner)
    private readonly repo: Repository<Partner>) { }
    async create(dto: CreatePartnerDto) {
        const exists = await this.repo.findOne({ where: { name: dto.name } });
        if (exists) {
            throw new ConflictException('Bu nomdagi partner allaqachon mavjud');
        }
        if (!dto.name || !dto.type) {
            throw new BadRequestException('name va type majburiy');
        }
        let partner: Partner;
        await this.repo.manager.transaction(async (manager) => {
            partner = manager.create(Partner, dto);
            partner = await manager.save(partner);
        });
        return partner!;
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('p').skip(skip).take(take);
        applySorting(qb, 'p', { default: 'id', id: 'id', name: 'name', type: 'type', created_at: 'created_at' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Partner not found');
        return e;
    }
    async update(id: string, dto: UpdatePartnerDto) {
        const partner = await this.findOne(id);
        if (!partner)
            throw new NotFoundException('Partner topilmadi');
        if (dto.name && dto.name !== partner.name) {
            const exists = await this.repo.findOne({ where: { name: dto.name } });
            if (exists)
                throw new ConflictException('Bu nomdagi partner allaqachon mavjud');
        }
        let updated: Partner;
        await this.repo.manager.transaction(async (manager) => {
            await manager.update(Partner, { id }, dto as Partial<Partner>);
            const found = await manager.findOne(Partner, { where: { id } });
            if (!found)
                throw new NotFoundException('Partner not found after update');
            updated = found;
        });
        return updated!;
    }
    async remove(id: string) {
        const txCount = await this.repo.manager.count(PartnerPointTransaction, { where: { partner_id: id } as any });
        if (txCount > 0) {
            throw new ConflictException('Partnerga bog‘langan transaction mavjud, o‘chirish mumkin emas');
        }
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Partner not found');
        return { success: true };
    }
}
