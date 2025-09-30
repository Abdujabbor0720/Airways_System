import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';
@Injectable()
export class PromotionsService {
    constructor(
    @InjectRepository(Promotion)
    private readonly repo: Repository<Promotion>) { }
    async create(dto: CreatePromotionDto) {
        if (!dto.code) {
            throw new BadRequestException('Promotion code majburiy');
        }
        const exists = await this.repo.findOne({ where: { code: dto.code } });
        if (exists) {
            throw new ConflictException('Bu code allaqachon mavjud');
        }
        if (dto.valid_from && dto.valid_to && new Date(dto.valid_from) > new Date(dto.valid_to)) {
            throw new BadRequestException('valid_from valid_to dan oldin bo‘lishi kerak');
        }
        let promo: Promotion;
        await this.repo.manager.transaction(async (manager) => {
            promo = manager.create(Promotion, dto);
            promo = await manager.save(promo);
        });
        return promo!;
    }
    findAll(skip = 0, take = 20) {
        return this.repo.findAndCount({ order: { id: 'DESC' }, skip, take });
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Promotion not found');
        return e;
    }
    async update(id: string, dto: UpdatePromotionDto) {
        const promo = await this.findOne(id);
        if (!promo)
            throw new NotFoundException('Promotion not found');
        if (dto.code && dto.code !== promo.code) {
            const exists = await this.repo.findOne({ where: { code: dto.code } });
            if (exists)
                throw new ConflictException('Bu code allaqachon mavjud');
        }
        if (dto.valid_from && dto.valid_to && new Date(dto.valid_from) > new Date(dto.valid_to)) {
            throw new BadRequestException('valid_from valid_to dan oldin bo‘lishi kerak');
        }
        let updated: Promotion | undefined;
        await this.repo.manager.transaction(async (manager) => {
            await manager.update(Promotion, { id }, dto as Partial<Promotion>);
            updated = await manager.findOne(Promotion, { where: { id } }) as Promotion | undefined;
        });
        if (!updated)
            throw new NotFoundException('Promotion not found after update');
        return updated;
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Promotion not found');
        return { success: true };
    }
    async findByCode(code: string) {
        if (!code)
            throw new BadRequestException('Code majburiy');
        const promo = await this.repo.findOne({ where: { code } });
        if (!promo)
            throw new NotFoundException('Promotion not found');
        const now = new Date();
        if (promo.valid_from && now < new Date(promo.valid_from))
            throw new BadRequestException('Promotion hali boshlanmagan');
        if (promo.valid_to && now > new Date(promo.valid_to))
            throw new BadRequestException('Promotion muddati o‘tgan');
        if (!promo.active)
            throw new BadRequestException('Promotion faol emas');
        return promo;
    }
}
