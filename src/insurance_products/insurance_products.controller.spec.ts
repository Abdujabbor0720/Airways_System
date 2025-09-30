import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceProductsController } from './insurance_products.controller';
import { InsuranceProductsService } from './insurance_products.service';
describe('InsuranceProductsController', () => {
    let controller: InsuranceProductsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InsuranceProductsController],
            providers: [InsuranceProductsService],
        }).compile();
        controller = module.get<InsuranceProductsController>(InsuranceProductsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
