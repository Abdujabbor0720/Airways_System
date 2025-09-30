import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyPointsLedgerController } from './loyalty_points_ledger.controller';
import { LoyaltyPointsLedgerService } from './loyalty_points_ledger.service';
describe('LoyaltyPointsLedgerController', () => {
    let controller: LoyaltyPointsLedgerController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoyaltyPointsLedgerController],
            providers: [LoyaltyPointsLedgerService],
        }).compile();
        controller = module.get<LoyaltyPointsLedgerController>(LoyaltyPointsLedgerController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
