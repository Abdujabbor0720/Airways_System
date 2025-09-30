import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyPointsLedgerService } from './loyalty_points_ledger.service';
describe('LoyaltyPointsLedgerService', () => {
    let service: LoyaltyPointsLedgerService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LoyaltyPointsLedgerService],
        }).compile();
        service = module.get<LoyaltyPointsLedgerService>(LoyaltyPointsLedgerService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
