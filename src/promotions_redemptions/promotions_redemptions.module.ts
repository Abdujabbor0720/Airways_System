import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionsRedemptionsService } from './promotions_redemptions.service';
import { PromotionsRedemptionsController } from './promotions_redemptions.controller';
import { PromotionsRedemption } from './entities/promotions_redemption.entity';
import { PromotionsModule } from '../promotions/promotions.module';
@Module({
    imports: [TypeOrmModule.forFeature([PromotionsRedemption]), PromotionsModule],
    controllers: [PromotionsRedemptionsController],
    providers: [PromotionsRedemptionsService],
    exports: [PromotionsRedemptionsService],
})
export class PromotionsRedemptionsModule {
}
