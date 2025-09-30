import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { Passenger } from './entities/passenger.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class PassengersService {
    constructor(
    @InjectRepository(Passenger)
    private readonly repo: Repository<Passenger>) { }
    async create(dto: CreatePassengerDto) {
        if (!dto.first_name || !dto.last_name) {
            throw new BadRequestException('first_name va last_name majburiy');
        }
        if (dto.document_type && !dto.document_number) {
            throw new BadRequestException('document_type bo‘lsa, document_number ham majburiy');
        }
        if (dto.document_type && dto.document_number) {
            const exists = await this.repo.findOne({ where: { document_type: dto.document_type, document_number: dto.document_number } });
            if (exists) {
                throw new ConflictException('Bu hujjat raqamli yo‘lovchi allaqachon mavjud');
            }
        }
        let passenger: Passenger;
        await this.repo.manager.transaction(async (manager) => {
            passenger = manager.create(Passenger, dto);
            passenger = await manager.save(passenger);
        });
        return passenger!;
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('p').skip(skip).take(take);
        applySorting(qb, 'p', { default: 'id', id: 'id', created_at: 'created_at', last_name: 'last_name' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('Passenger not found');
        return entity;
    }
    async update(id: string, dto: UpdatePassengerDto) {
        const passenger = await this.findOne(id);
        if (!passenger)
            throw new NotFoundException('Passenger not found');
        if (dto.document_type && dto.document_number && (dto.document_type !== passenger.document_type || dto.document_number !== passenger.document_number)) {
            const exists = await this.repo.findOne({ where: { document_type: dto.document_type, document_number: dto.document_number } });
            if (exists)
                throw new ConflictException('Bu hujjat raqamli yo‘lovchi allaqachon mavjud');
        }
        let updated: Passenger | null = null;
        await this.repo.manager.transaction(async (manager) => {
            await manager.update(Passenger, { id }, dto as Partial<Passenger>);
            updated = await manager.findOne(Passenger, { where: { id } });
        });
        if (!updated)
            throw new NotFoundException('Passenger not found after update');
        return updated;
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Passenger not found');
        return { success: true };
    }
}
