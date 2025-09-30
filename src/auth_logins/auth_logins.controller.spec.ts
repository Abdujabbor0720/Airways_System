import { Test, TestingModule } from '@nestjs/testing';
import { AuthLoginsController } from './auth_logins.controller';
import { AuthLoginsService } from './auth_logins.service';
describe('AuthLoginsController', () => {
    let controller: AuthLoginsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthLoginsController],
            providers: [AuthLoginsService],
        }).compile();
        controller = module.get<AuthLoginsController>(AuthLoginsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
