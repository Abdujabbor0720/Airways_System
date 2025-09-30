import { Test, TestingModule } from '@nestjs/testing';
import { FareClassesController } from './fare_classes.controller';
import { FareClassesService } from './fare_classes.service';
describe('FareClassesController', () => {
    let controller: FareClassesController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FareClassesController],
            providers: [FareClassesService],
        }).compile();
        controller = module.get<FareClassesController>(FareClassesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
