import { Test, TestingModule } from '@nestjs/testing';
import { TicketsCouponsService } from './tickets_coupons.service';
describe('TicketsCouponsService', () => {
    let service: TicketsCouponsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TicketsCouponsService],
        }).compile();
        service = module.get<TicketsCouponsService>(TicketsCouponsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
