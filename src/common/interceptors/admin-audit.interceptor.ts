import { CallHandler, ExecutionContext, Injectable, NestInterceptor, } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AdminActivityLogsService } from '../../admin_activity_logs/admin_activity_logs.service';
import { Role } from '../../auth/roles.decorator';
type AuthUser = {
    sub?: string;
    role?: Role | string;
};
@Injectable()
export class AdminAuditInterceptor implements NestInterceptor {
    constructor(private readonly logs: AdminActivityLogsService) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const user = (req?.user || {}) as AuthUser;
        const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
        if (!isAdmin)
            return next.handle();
        const method: string = req.method;
        const path: string = req.originalUrl ?? req.url ?? '';
        const ip: string | undefined = req.ip;
        const admin_user_id: string | undefined = user?.sub as string | undefined;
        const entity_type = this.inferEntityType(path);
        const entity_id = this.inferEntityId(req.params);
        const details = this.sanitize({ params: req.params, query: req.query, body: req.body });
        return next.handle().pipe(tap(async () => {
            try {
                await this.logs.create({
                    admin_user_id,
                    action: method,
                    entity_type,
                    entity_id,
                    details,
                    ip,
                });
            }
            catch {
            }
        }));
    }
    private inferEntityType(path: string): string {
        const match = path.split('?')[0].split('/').filter(Boolean);
        return (match[1] || match[0] || 'unknown').replace(/-/g, '_');
    }
    private inferEntityId(params: Record<string, string | undefined>): string | undefined {
        return params?.id;
    }
    private sanitize(obj: unknown): Record<string, unknown> | undefined {
        if (!obj || typeof obj !== 'object')
            return undefined;
        const forbiddenKeys = new Set(['password', 'password_hash', 'token', 'refresh_token']);
        const recurse = (val: any): any => {
            if (val && typeof val === 'object') {
                if (Array.isArray(val))
                    return val.map(recurse);
                const out: Record<string, unknown> = {};
                Object.entries(val).forEach(([k, v]) => {
                    if (forbiddenKeys.has(k))
                        return;
                    out[k] = recurse(v);
                });
                return out;
            }
            return val;
        };
        return recurse(obj);
    }
}
