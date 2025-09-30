import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceProductsService } from './insurance_products.service';
describe('InsuranceProductsService', () => {
    let service: InsuranceProductsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InsuranceProductsService],
        }).compile();
        service = module.get<InsuranceProductsService>(InsuranceProductsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
