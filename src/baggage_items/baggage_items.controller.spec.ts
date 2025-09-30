import { Test, TestingModule } from '@nestjs/testing';
import { BaggageItemsController } from './baggage_items.controller';
import { BaggageItemsService } from './baggage_items.service';
describe('BaggageItemsController', () => {
    let controller: BaggageItemsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BaggageItemsController],
            providers: [BaggageItemsService],
        }).compile();
        controller = module.get<BaggageItemsController>(BaggageItemsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
