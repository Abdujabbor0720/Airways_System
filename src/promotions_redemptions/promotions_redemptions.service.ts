import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePromotionsRedemptionDto } from './dto/update-promotions_redemption.dto';
import { PromotionsRedemption } from './entities/promotions_redemption.entity';
import { PromotionsService } from '../promotions/promotions.service';
@Injectable()
export class PromotionsRedemptionsService {
    constructor(
    @InjectRepository(PromotionsRedemption)
    private readonly repo: Repository<PromotionsRedemption>, private readonly promotions: PromotionsService) { }
    async redeemByCode(code: string, userId?: string, bookingId?: string) {
        if (!code)
            throw new BadRequestException('Promotion code majburiy');
        if (!userId && !bookingId)
            throw new BadRequestException('user_id yoki booking_id majburiy');
        let redemption: PromotionsRedemption;
        await this.repo.manager.transaction(async (manager) => {
            const promo = await this.promotions.findByCode(code);
            if (!promo)
                throw new NotFoundException('Promotion not found');
            const exists = await manager.findOne(PromotionsRedemption, {
                where: {
                    promotion_id: promo.id,
                    user_id: userId ?? undefined,
                    booking_id: bookingId ?? undefined,
                }
            });
            if (exists)
                throw new ConflictException('Bu user/booking uchun ushbu promotion allaqachon redeem qilingan');
            const today = new Date();
            if (promo.active === false)
                throw new BadRequestException('Promotion inactive');
            if (promo.valid_from && new Date(promo.valid_from) > today)
                throw new BadRequestException('Promotion not started');
            if (promo.valid_to && new Date(promo.valid_to) < today)
                throw new BadRequestException('Promotion expired');
            redemption = manager.create(PromotionsRedemption, {
                promotion_id: promo.id,
                user_id: userId ?? undefined,
                booking_id: bookingId ?? undefined,
            });
            redemption = await manager.save(redemption);
        });
        return redemption!;
    }
    findAll(skip = 0, take = 20) {
        return this.repo.findAndCount({ order: { id: 'DESC' }, skip, take });
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Redemption not found');
        return e;
    }
    async update(id: string, dto: UpdatePromotionsRedemptionDto) {
        throw new ConflictException('Redemptionni o‘zgartirish mumkin emas');
    }
    async remove(id: string) {
        throw new ConflictException('Redemptionni o‘chirish mumkin emas');
    }
}
