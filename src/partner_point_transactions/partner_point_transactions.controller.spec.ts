import { Test, TestingModule } from '@nestjs/testing';
import { PartnerPointTransactionsController } from './partner_point_transactions.controller';
import { PartnerPointTransactionsService } from './partner_point_transactions.service';
describe('PartnerPointTransactionsController', () => {
    let controller: PartnerPointTransactionsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PartnerPointTransactionsController],
            providers: [PartnerPointTransactionsService],
        }).compile();
        controller = module.get<PartnerPointTransactionsController>(PartnerPointTransactionsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
