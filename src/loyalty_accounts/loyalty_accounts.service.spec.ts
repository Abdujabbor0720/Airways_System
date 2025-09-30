import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyAccountsService } from './loyalty_accounts.service';
describe('LoyaltyAccountsService', () => {
    let service: LoyaltyAccountsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LoyaltyAccountsService],
        }).compile();
        service = module.get<LoyaltyAccountsService>(LoyaltyAccountsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
