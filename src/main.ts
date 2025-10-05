import helmet from 'helmet';
import { DataSource } from 'typeorm';
import xssClean from 'xss-clean';
import { v4 as uuidv4 } from 'uuid';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpErrorFilter } from './common/filters/http-exception.filter';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { REDIS } from './common/redis/redis.module';
import * as fs from 'fs';
import * as path from 'path';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.use(helmet());
    app.use(xssClean());
    app.use((req, res, next) => {
        req.requestId = req.headers['x-request-id'] || uuidv4();
        next();
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        stopAtFirstError: true,
        validateCustomDecorators: true,
        disableErrorMessages: false,
    }));
    app.useGlobalFilters(new HttpErrorFilter());
    const configService = app.get(ConfigService);
    const corsEnv = configService.get<string>('CORS_ORIGIN');
    const origin = corsEnv ? corsEnv.split(',').map((s) => s.trim()) : '*'; // Allow all origins
    app.enableCors({ 
        origin, 
        credentials: false, // Changed from true to false for wildcard origin
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
        allowedHeaders: ['Authorization', 'Content-Type', 'X-Trace-Id', 'X-Request-Id'],
        exposedHeaders: ['X-Request-Id']
    });
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Airways API')
        .setDescription('Airways platform API documentation')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
    try {
        const redis = app.get(REDIS);
        if (!redis)
            throw new Error('Redis init xatolik');
    }
    catch (err) {
        const logPath = path.join(__dirname, '../logs/error.log');
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] Redis error: ${err?.message || err}\n`);
    }
    try {
        const db = app.get(DataSource);
        if (db && typeof db.query === 'function') {
            await db.query('SELECT 1');
        }
    }
    catch (err) {
        const logPath = path.join(__dirname, '../logs/error.log');
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] DB error: ${err?.message || err}\n`);
    }
    if (!configService) {
        const logPath = path.join(__dirname, '../logs/error.log');
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] ConfigService error: ConfigService is not available\n`);
    }
    const port = configService.get<number>('PORT', 3000);
    await app.listen(port);
    const baseUrl = `http://localhost:${port}`;
    console.log(`\n🚀 Server running:      ${baseUrl}/api`);
    console.log(`📚 Swagger docs:       ${baseUrl}/docs\n`);
}
bootstrap();
