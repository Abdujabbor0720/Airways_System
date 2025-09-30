import { Test, TestingModule } from '@nestjs/testing';
import { BaggagePoliciesController } from './baggage_policies.controller';
import { BaggagePoliciesService } from './baggage_policies.service';
describe('BaggagePoliciesController', () => {
    let controller: BaggagePoliciesController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BaggagePoliciesController],
            providers: [BaggagePoliciesService],
        }).compile();
        controller = module.get<BaggagePoliciesController>(BaggagePoliciesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
