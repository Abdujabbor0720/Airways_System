import { Test, TestingModule } from '@nestjs/testing';
import { SupportTicketsController } from './support_tickets.controller';
import { SupportTicketsService } from './support_tickets.service';
describe('SupportTicketsController', () => {
    let controller: SupportTicketsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SupportTicketsController],
            providers: [SupportTicketsService],
        }).compile();
        controller = module.get<SupportTicketsController>(SupportTicketsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
