import { Test, TestingModule } from '@nestjs/testing';
import { UserSearchHistoryService } from './user_search_history.service';
describe('UserSearchHistoryService', () => {
    let service: UserSearchHistoryService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserSearchHistoryService],
        }).compile();
        service = module.get<UserSearchHistoryService>(UserSearchHistoryService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
