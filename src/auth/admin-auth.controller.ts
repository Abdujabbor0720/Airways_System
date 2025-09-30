import { Body, Controller, HttpCode, Ip, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AdminAuthService } from './admin-auth.service';
import { TokensDto } from './dto/tokens.dto';
import { LoginDto } from './dto/login.dto';
@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AdminAuthController {
    constructor(private readonly service: AdminAuthService) { }
    @Post('login')
    @ApiOperation({ summary: 'Admin login (returns access and refresh tokens)' })
    @HttpCode(200)
    @ApiOkResponse({ type: TokensDto })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'admin@example.com' },
                password: { type: 'string', example: 'ChangeMe123!' },
            },
            required: ['email', 'password'],
        },
    })
    login(
    @Body()
    body: LoginDto, 
    @Ip()
    ip: string, 
    @Req()
    req: Request) {
        const ua = req.headers['user-agent'] ?? '';
        return this.service.login(body.email, body.password, ip, String(ua));
    }
}
