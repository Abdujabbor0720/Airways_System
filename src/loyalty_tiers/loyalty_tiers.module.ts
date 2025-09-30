import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyTiersService } from './loyalty_tiers.service';
import { LoyaltyTiersController } from './loyalty_tiers.controller';
import { LoyaltyTier } from './entities/loyalty_tier.entity';
@Module({
    imports: [TypeOrmModule.forFeature([LoyaltyTier])],
    controllers: [LoyaltyTiersController],
    providers: [LoyaltyTiersService],
    exports: [LoyaltyTiersService],
})
export class LoyaltyTiersModule {
}
