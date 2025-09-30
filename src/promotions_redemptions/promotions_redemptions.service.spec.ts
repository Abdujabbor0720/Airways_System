import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsRedemptionsService } from './promotions_redemptions.service';
describe('PromotionsRedemptionsService', () => {
    let service: PromotionsRedemptionsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PromotionsRedemptionsService],
        }).compile();
        service = module.get<PromotionsRedemptionsService>(PromotionsRedemptionsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
