import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyTiersService } from './loyalty_tiers.service';
describe('LoyaltyTiersService', () => {
    let service: LoyaltyTiersService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LoyaltyTiersService],
        }).compile();
        service = module.get<LoyaltyTiersService>(LoyaltyTiersService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
