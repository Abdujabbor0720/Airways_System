import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class OptionalJwtGuard implements CanActivate {
    constructor(private readonly jwt: JwtService, private readonly cfg: ConfigService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const auth = (req.headers?.authorization || '') as string;
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
        if (!token)
            return true;
        try {
            const payload = await this.jwt.verifyAsync(token, {
                secret: this.cfg.get<string>('JWT_SECRET', 'dev-secret'),
            });
            req.user = payload;
        }
        catch {
        }
        return true;
    }
}
