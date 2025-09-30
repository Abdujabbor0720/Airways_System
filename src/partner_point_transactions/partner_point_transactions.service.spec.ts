import { Test, TestingModule } from '@nestjs/testing';
import { PartnerPointTransactionsService } from './partner_point_transactions.service';
describe('PartnerPointTransactionsService', () => {
    let service: PartnerPointTransactionsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PartnerPointTransactionsService],
        }).compile();
        service = module.get<PartnerPointTransactionsService>(PartnerPointTransactionsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
