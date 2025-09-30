import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceProvidersController } from './insurance_providers.controller';
import { InsuranceProvidersService } from './insurance_providers.service';
describe('InsuranceProvidersController', () => {
    let controller: InsuranceProvidersController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InsuranceProvidersController],
            providers: [InsuranceProvidersService],
        }).compile();
        controller = module.get<InsuranceProvidersController>(InsuranceProvidersController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
