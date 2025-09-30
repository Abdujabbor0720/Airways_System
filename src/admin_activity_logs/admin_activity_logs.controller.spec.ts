import { Test, TestingModule } from '@nestjs/testing';
import { AdminActivityLogsController } from './admin_activity_logs.controller';
import { AdminActivityLogsService } from './admin_activity_logs.service';
describe('AdminActivityLogsController', () => {
    let controller: AdminActivityLogsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminActivityLogsController],
            providers: [AdminActivityLogsService],
        }).compile();
        controller = module.get<AdminActivityLogsController>(AdminActivityLogsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
