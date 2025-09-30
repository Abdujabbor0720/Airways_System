import { Test, TestingModule } from '@nestjs/testing';
import { CorporateContractsController } from './corporate_contracts.controller';
import { CorporateContractsService } from './corporate_contracts.service';
describe('CorporateContractsController', () => {
    let controller: CorporateContractsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CorporateContractsController],
            providers: [CorporateContractsService],
        }).compile();
        controller = module.get<CorporateContractsController>(CorporateContractsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
