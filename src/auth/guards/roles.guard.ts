import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../roles.decorator';
type AuthUser = {
    sub?: string;
    role?: Role | string;
};
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(ctx: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (!required || required.length === 0)
            return true;
        const req = ctx.switchToHttp().getRequest();
        const user = req.user as AuthUser;
        if (!user?.role)
            return false;
        return required.includes(user.role as Role);
    }
}
