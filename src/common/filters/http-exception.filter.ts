import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const traceId = request.headers['x-trace-id'] || undefined;
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let details: unknown = undefined;
        let code = 'INTERNAL_ERROR';
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string')
                message = res;
            else if (typeof res === 'object' && res) {
                const obj = res as Record<string, any>;
                message = obj.message ?? message;
                details = obj.details ?? obj.error ?? undefined;
            }
            code = (exception.name || 'HTTP_ERROR').toUpperCase();
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        response.status(status).json({
            error: { code, message, details },
            traceId,
        });
    }
}
