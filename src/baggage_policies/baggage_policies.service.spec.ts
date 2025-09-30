import { Test, TestingModule } from '@nestjs/testing';
import { BaggagePoliciesService } from './baggage_policies.service';
describe('BaggagePoliciesService', () => {
    let service: BaggagePoliciesService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BaggagePoliciesService],
        }).compile();
        service = module.get<BaggagePoliciesService>(BaggagePoliciesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
