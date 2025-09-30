import { Test, TestingModule } from '@nestjs/testing';
import { MealOptionsController } from './meal_options.controller';
import { MealOptionsService } from './meal_options.service';
describe('MealOptionsController', () => {
    let controller: MealOptionsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MealOptionsController],
            providers: [MealOptionsService],
        }).compile();
        controller = module.get<MealOptionsController>(MealOptionsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
