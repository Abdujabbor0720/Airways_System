import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceProvidersService } from './insurance_providers.service';
describe('InsuranceProvidersService', () => {
    let service: InsuranceProvidersService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InsuranceProvidersService],
        }).compile();
        service = module.get<InsuranceProvidersService>(InsuranceProvidersService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
