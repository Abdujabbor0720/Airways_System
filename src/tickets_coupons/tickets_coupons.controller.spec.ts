import { Test, TestingModule } from '@nestjs/testing';
import { TicketsCouponsController } from './tickets_coupons.controller';
import { TicketsCouponsService } from './tickets_coupons.service';
describe('TicketsCouponsController', () => {
    let controller: TicketsCouponsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TicketsCouponsController],
            providers: [TicketsCouponsService],
        }).compile();
        controller = module.get<TicketsCouponsController>(TicketsCouponsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
