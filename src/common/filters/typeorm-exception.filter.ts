import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
    catch(exception: QueryFailedError & {
        code?: string;
        detail?: string;
    }, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const traceId = request.headers['x-trace-id'] || undefined;
        let status = HttpStatus.BAD_REQUEST;
        let code = 'DB_ERROR';
        let message = 'Database error';
        switch (exception.code) {
            case '23505':
                status = HttpStatus.CONFLICT;
                code = 'UNIQUE_VIOLATION';
                message = 'Resource already exists';
                break;
            case '23503':
                status = HttpStatus.BAD_REQUEST;
                code = 'FOREIGN_KEY_VIOLATION';
                message = 'Invalid reference';
                break;
            case '23502':
                status = HttpStatus.BAD_REQUEST;
                code = 'NOT_NULL_VIOLATION';
                message = 'Missing required field';
                break;
            case '23514':
                status = HttpStatus.BAD_REQUEST;
                code = 'CHECK_VIOLATION';
                message = 'Constraint violation';
                break;
        }
        response.status(status).json({ error: { code, message, details: exception.detail }, traceId });
    }
}
