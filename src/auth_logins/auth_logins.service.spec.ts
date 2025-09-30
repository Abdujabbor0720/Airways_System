import { Test, TestingModule } from '@nestjs/testing';
import { AuthLoginsService } from './auth_logins.service';
describe('AuthLoginsService', () => {
    let service: AuthLoginsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthLoginsService],
        }).compile();
        service = module.get<AuthLoginsService>(AuthLoginsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
