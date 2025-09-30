import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { Seat } from './entities/seat.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class SeatsService {
    constructor(
    @InjectRepository(Seat)
    private readonly repo: Repository<Seat>) { }
    async create(dto: CreateSeatDto) {
        if (!dto.plane_id || !dto.seat_number || !dto.seat_class_id) {
            throw new BadRequestException('plane_id, seat_number, seat_class_id majburiy');
        }
        const exists = await this.repo.findOne({ where: { plane_id: dto.plane_id, seat_number: dto.seat_number } });
        if (exists) {
            throw new ConflictException('Bu seat_number ushbu plane uchun allaqachon mavjud');
        }
        let seat: Seat;
        await this.repo.manager.transaction(async (manager) => {
            seat = manager.create(Seat, dto);
            seat = await manager.save(seat);
        });
        return seat!;
    }
    findAll(page: PaginationDto, planeId?: string) {
        const take = Math.min(page.limit ?? 50, 200);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('s').skip(skip).take(take);
        if (planeId)
            qb.andWhere('s.plane_id = :planeId', { planeId });
        applySorting(qb, 's', { default: 'seat_number', seat_number: 'seat_number', id: 'id', created_at: 'created_at' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Seat not found');
        return e;
    }
    async update(id: string, dto: UpdateSeatDto) {
        const seat = await this.findOne(id);
        if (!seat)
            throw new NotFoundException('Seat not found');
        if (dto.seat_number && dto.seat_number !== seat.seat_number) {
            const exists = await this.repo.findOne({ where: { plane_id: seat.plane_id, seat_number: dto.seat_number } });
            if (exists)
                throw new ConflictException('Bu seat_number ushbu plane uchun allaqachon mavjud');
        }
        let updated: Seat | undefined = undefined;
        await this.repo.manager.transaction(async (manager) => {
            await manager.update(Seat, { id }, dto as Partial<Seat>);
            const found = await manager.findOne(Seat, { where: { id } });
            updated = found === null ? undefined : found;
            if (!updated) {
                throw new NotFoundException('Updated seat not found');
            }
        });
        return updated;
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Seat not found');
        return { success: true };
    }
}
