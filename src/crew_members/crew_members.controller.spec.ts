import { Test, TestingModule } from '@nestjs/testing';
import { CrewMembersController } from './crew_members.controller';
import { CrewMembersService } from './crew_members.service';
describe('CrewMembersController', () => {
    let controller: CrewMembersController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CrewMembersController],
            providers: [CrewMembersService],
        }).compile();
        controller = module.get<CrewMembersController>(CrewMembersController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
