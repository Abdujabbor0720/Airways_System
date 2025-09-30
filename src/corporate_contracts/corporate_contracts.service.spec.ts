import { Test, TestingModule } from '@nestjs/testing';
import { CorporateContractsService } from './corporate_contracts.service';
describe('CorporateContractsService', () => {
    let service: CorporateContractsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CorporateContractsService],
        }).compile();
        service = module.get<CorporateContractsService>(CorporateContractsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
