import { Body, Controller, HttpCode, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';
import { TokensDto } from './dto/tokens.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('register')
    @ApiOperation({ summary: 'User register (issues email verification token)' })
    async register(
    @Body()
    dto: RegisterDto) {
        return this.authService.register(dto);
    }
    @Post('login')
    @ApiOperation({ summary: 'User login (returns access and refresh tokens)' })
    @HttpCode(200)
    @ApiOkResponse({ type: TokensDto })
    async login(
    @Body()
    dto: LoginDto, 
    @Ip()
    ip: string, 
    @Req()
    req: Request) {
        const ua = req.headers['user-agent'] ?? '';
        return this.authService.login(dto, ip, String(ua));
    }
    @Post('refresh')
    @ApiOperation({ summary: 'Refresh tokens using refresh_token' })
    @HttpCode(200)
    @ApiOkResponse({ type: TokensDto })
    async refresh(
    @Body()
    dto: RefreshDto) {
        return this.authService.refresh(dto.refresh_token);
    }
    @Post('email-verify')
    @ApiOperation({ summary: 'Confirm email by token' })
    async emailVerify(
    @Body()
    body: {
        token: string;
    }) {
        return this.authService.verifyEmail(body.token);
    }
    @Post('password-reset/request')
    @ApiOperation({ summary: 'Request password reset (email with token)' })
    async passwordResetRequest(
    @Body()
    body: {
        email: string;
    }) {
        return this.authService.passwordResetRequest(body.email);
    }
    @Post('password-reset/confirm')
    @ApiOperation({ summary: 'Confirm password reset with token' })
    async passwordResetConfirm(
    @Body()
    body: {
        token: string;
        new_password: string;
    }) {
        return this.authService.passwordResetConfirm(body.token, body.new_password);
    }
}
