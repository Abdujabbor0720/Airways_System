import { Test, TestingModule } from '@nestjs/testing';
import { UserSearchHistoryController } from './user_search_history.controller';
import { UserSearchHistoryService } from './user_search_history.service';
describe('UserSearchHistoryController', () => {
    let controller: UserSearchHistoryController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserSearchHistoryController],
            providers: [UserSearchHistoryService],
        }).compile();
        controller = module.get<UserSearchHistoryController>(UserSearchHistoryController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
