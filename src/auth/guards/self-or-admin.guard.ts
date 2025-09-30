import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
export class SelfOrAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const user = (req?.user || {}) as {
            sub?: string;
            role?: string;
        };
        if (!user || !user.sub)
            return false;
        const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
        if (isAdmin)
            return true;
        const id = req.params?.id as string | undefined;
        return !!id && id === String(user.sub);
    }
}
