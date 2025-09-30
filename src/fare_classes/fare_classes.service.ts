import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateFareClassDto } from './dto/create-fare_class.dto';
import { UpdateFareClassDto } from './dto/update-fare_class.dto';
import { FareClass } from './entities/fare_class.entity';
@Injectable()
export class FareClassesService {
    constructor(
    @InjectRepository(FareClass)
    private readonly repo: Repository<FareClass>, private readonly dataSource: DataSource) { }
    async create(dto: CreateFareClassDto) {
        return this.dataSource.transaction(async (manager) => {
            const exists = await manager.findOne(FareClass, { where: { code: dto.code, seat_class_id: dto.seat_class_id } });
            if (exists)
                throw new ConflictException('Fare code already exists for this airline/seat class');
            if (dto.refundable === false && dto.changeable === false && !dto.baggage_policy_id) {
                throw new BadRequestException('Non-refundable and non-changeable fares must have a baggage policy');
            }
            if (dto.advance_purchase_days && dto.advance_purchase_days < 0) {
                throw new BadRequestException('Advance purchase days must be positive');
            }
            const entity = manager.create(FareClass, dto as Partial<FareClass>);
            return await manager.save(entity);
        });
    }
    findAll(skip = 0, take = 20) {
        return this.repo.findAndCount({ order: { code: 'ASC' }, skip, take });
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Fare class not found');
        return e;
    }
    async update(id: string, dto: UpdateFareClassDto) {
        return this.dataSource.transaction(async (manager) => {
            const fare = await manager.findOne(FareClass, { where: { id } });
            if (!fare)
                throw new NotFoundException('Fare class not found');
            if (dto.code && dto.seat_class_id) {
                const exists = await manager.findOne(FareClass, { where: { code: dto.code, seat_class_id: dto.seat_class_id } });
                if (exists && exists.id !== id)
                    throw new ConflictException('Fare code already exists for this airline/seat class');
            }
            if (dto.refundable === false && dto.changeable === false && !dto.baggage_policy_id) {
                throw new BadRequestException('Non-refundable and non-changeable fares must have a baggage policy');
            }
            if (dto.advance_purchase_days && dto.advance_purchase_days < 0) {
                throw new BadRequestException('Advance purchase days must be positive');
            }
            await manager.update(FareClass, { id }, dto as Partial<FareClass>);
            return this.findOne(id);
        });
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Fare class not found');
        return { success: true };
    }
}
