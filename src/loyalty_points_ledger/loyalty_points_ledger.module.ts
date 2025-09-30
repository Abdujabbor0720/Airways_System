import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyPointsLedgerService } from './loyalty_points_ledger.service';
import { LoyaltyPointsLedgerController } from './loyalty_points_ledger.controller';
import { LoyaltyPointsLedger } from './entities/loyalty_points_ledger.entity';
import { LoyaltyAccountsModule } from '../loyalty_accounts/loyalty_accounts.module';
@Module({
    imports: [TypeOrmModule.forFeature([LoyaltyPointsLedger]), LoyaltyAccountsModule],
    controllers: [LoyaltyPointsLedgerController],
    providers: [LoyaltyPointsLedgerService],
    exports: [LoyaltyPointsLedgerService],
})
export class LoyaltyPointsLedgerModule {
}
