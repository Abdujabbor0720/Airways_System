import { Test, TestingModule } from '@nestjs/testing';
import { BaggageItemsService } from './baggage_items.service';
describe('BaggageItemsService', () => {
    let service: BaggageItemsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BaggageItemsService],
        }).compile();
        service = module.get<BaggageItemsService>(BaggageItemsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
