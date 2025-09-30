import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const query = (req?.query ?? {}) as Record<string, any>;

    return next.handle().pipe(
      map((res: any) => {
        if (!res) return res;

        if (res && typeof res === 'object' && 'data' in res && res.meta) return res;

        let items: any[] | undefined;
        let total: number | undefined;

        if (Array.isArray(res) && res.length === 2 && Array.isArray(res[0]) && typeof res[1] === 'number') {
          items = res[0];
          total = res[1];
        }

        if (!items && res && typeof res === 'object' && 'items' in res && typeof (res as any).total === 'number') {
          items = (res as any).items;
          total = (res as any).total;
        }

        if (!items && res && typeof res === 'object' && 'data' in res && typeof (res as any).count === 'number') {
          items = (res as any).data;
          total = (res as any).count;
        }

        if (items === undefined || total === undefined) {
          return res; // Not a paginated payload
        }

        const parsedLimit = Number(query.limit);
        const limit = Math.min(!isNaN(parsedLimit) && parsedLimit > 0 ? parsedLimit : 20, 100);
        const parsedPage = Number(query.page);
        const parsedOffset = Number(query.offset);
        let page = 1;
        if (!isNaN(parsedPage) && parsedPage > 0) {
          page = parsedPage;
        } else if (!isNaN(parsedOffset) && parsedOffset >= 0) {
          page = Math.floor(parsedOffset / limit) + 1;
        }
        const lastPage = Math.max(1, Math.ceil((total ?? 0) / limit));

        return {
          data: items ?? [],
          meta: {
            total: total ?? 0,
            page,
            limit,
            lastPage,
          },
        };
      }),
    );
  }
}
