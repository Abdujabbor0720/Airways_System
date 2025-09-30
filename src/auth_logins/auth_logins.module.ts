import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthLoginsService } from './auth_logins.service';
import { AuthLogin } from './entities/auth_login.entity';
import { forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
@Module({
    imports: [TypeOrmModule.forFeature([AuthLogin]), forwardRef(() => AuthModule), JwtModule],
    controllers: [],
    providers: [AuthLoginsService],
    exports: [AuthLoginsService],
})
export class AuthLoginsModule {
}
