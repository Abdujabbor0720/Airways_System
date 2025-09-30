import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsRedemptionsController } from './promotions_redemptions.controller';
import { PromotionsRedemptionsService } from './promotions_redemptions.service';
describe('PromotionsRedemptionsController', () => {
    let controller: PromotionsRedemptionsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PromotionsRedemptionsController],
            providers: [PromotionsRedemptionsService],
        }).compile();
        controller = module.get<PromotionsRedemptionsController>(PromotionsRedemptionsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
