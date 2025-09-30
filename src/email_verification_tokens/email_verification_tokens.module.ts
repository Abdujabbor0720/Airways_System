import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationTokensService } from './email_verification_tokens.service';
import { EmailVerificationToken } from './entities/email_verification_token.entity';
@Module({
    imports: [TypeOrmModule.forFeature([EmailVerificationToken])],
    controllers: [],
    providers: [EmailVerificationTokensService],
    exports: [EmailVerificationTokensService],
})
export class EmailVerificationTokensModule {
}
