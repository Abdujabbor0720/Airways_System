import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyAccountsController } from './loyalty_accounts.controller';
import { LoyaltyAccountsService } from './loyalty_accounts.service';
describe('LoyaltyAccountsController', () => {
    let controller: LoyaltyAccountsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoyaltyAccountsController],
            providers: [LoyaltyAccountsService],
        }).compile();
        controller = module.get<LoyaltyAccountsController>(LoyaltyAccountsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
