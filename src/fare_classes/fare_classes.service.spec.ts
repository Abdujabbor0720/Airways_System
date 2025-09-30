import { Test, TestingModule } from '@nestjs/testing';
import { FareClassesService } from './fare_classes.service';
describe('FareClassesService', () => {
    let service: FareClassesService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FareClassesService],
        }).compile();
        service = module.get<FareClassesService>(FareClassesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
