import { Test, TestingModule } from '@nestjs/testing';
import { MealOptionsService } from './meal_options.service';
describe('MealOptionsService', () => {
    let service: MealOptionsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MealOptionsService],
        }).compile();
        service = module.get<MealOptionsService>(MealOptionsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
