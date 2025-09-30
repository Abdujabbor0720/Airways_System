import { AdminUsersModule } from '../admin_users/admin_users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { UsersModule } from '../users/users.module';
import { EmailVerificationTokensModule } from '../email_verification_tokens/email_verification_tokens.module';
import { PasswordResetTokensModule } from '../password_reset_tokens/password_reset_tokens.module';
import { forwardRef } from '@nestjs/common';
import { AuthLoginsModule } from '../auth_logins/auth_logins.module';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { MailModule } from '../common/mail/mail.module';
@Module({
    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => ({
                secret: cfg.get<string>('JWT_SECRET', 'dev-secret'),
                signOptions: { expiresIn: cfg.get<string>('JWT_ACCESS_TTL', '15m') },
            }),
        }),
        UsersModule,
        AdminUsersModule,
        EmailVerificationTokensModule,
        PasswordResetTokensModule,
        forwardRef(() => AuthLoginsModule),
        MailModule,
    ],
    controllers: [AuthController, AdminAuthController],
    providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, AdminAuthService],
    exports: [JwtModule],
})
export class AuthModule {
}
