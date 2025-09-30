import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetTokensService } from './password_reset_tokens.service';
import { PasswordResetTokensController } from './password_reset_tokens.controller';
import { PasswordResetToken } from './entities/password_reset_token.entity';
@Module({
    imports: [TypeOrmModule.forFeature([PasswordResetToken])],
    controllers: [PasswordResetTokensController],
    providers: [PasswordResetTokensService],
    exports: [PasswordResetTokensService],
})
export class PasswordResetTokensModule {
}
