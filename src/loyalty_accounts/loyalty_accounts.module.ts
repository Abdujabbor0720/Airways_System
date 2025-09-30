import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyAccountsService } from './loyalty_accounts.service';
import { LoyaltyAccountsController } from './loyalty_accounts.controller';
import { LoyaltyAccount } from './entities/loyalty_account.entity';
import { LoyaltyTiersModule } from '../loyalty_tiers/loyalty_tiers.module';
@Module({
    imports: [TypeOrmModule.forFeature([LoyaltyAccount]), LoyaltyTiersModule],
    controllers: [LoyaltyAccountsController],
    providers: [LoyaltyAccountsService],
    exports: [LoyaltyAccountsService],
})
export class LoyaltyAccountsModule {
}
