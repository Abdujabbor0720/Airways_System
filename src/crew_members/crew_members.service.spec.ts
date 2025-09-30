import { Test, TestingModule } from '@nestjs/testing';
import { CrewMembersService } from './crew_members.service';
describe('CrewMembersService', () => {
    let service: CrewMembersService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CrewMembersService],
        }).compile();
        service = module.get<CrewMembersService>(CrewMembersService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
