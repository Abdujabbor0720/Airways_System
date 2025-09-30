import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralsService } from './referrals.service';
import { ReferralsController } from './referrals.controller';
import { Referral } from './entities/referral.entity';
import { LoyaltyAccountsModule } from '../loyalty_accounts/loyalty_accounts.module';
import { LoyaltyPointsLedgerModule } from '../loyalty_points_ledger/loyalty_points_ledger.module';
@Module({
    imports: [TypeOrmModule.forFeature([Referral]), LoyaltyAccountsModule, LoyaltyPointsLedgerModule],
    controllers: [ReferralsController],
    providers: [ReferralsService],
})
export class ReferralsModule {
}
