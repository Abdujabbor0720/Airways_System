import { Test, TestingModule } from '@nestjs/testing';
import { SupportMessagesController } from './support_messages.controller';
import { SupportMessagesService } from './support_messages.service';
describe('SupportMessagesController', () => {
    let controller: SupportMessagesController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SupportMessagesController],
            providers: [SupportMessagesService],
        }).compile();
        controller = module.get<SupportMessagesController>(SupportMessagesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
