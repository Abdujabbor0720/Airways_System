import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyTiersController } from './loyalty_tiers.controller';
import { LoyaltyTiersService } from './loyalty_tiers.service';
describe('LoyaltyTiersController', () => {
    let controller: LoyaltyTiersController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoyaltyTiersController],
            providers: [LoyaltyTiersService],
        }).compile();
        controller = module.get<LoyaltyTiersController>(LoyaltyTiersController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
