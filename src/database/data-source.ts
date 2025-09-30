import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
(() => {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (!fs.existsSync(envPath))
            return;
        const content = fs.readFileSync(envPath, 'utf8');
        for (const line of content.split(/\r?\n/)) {
            if (!line || line.trim().startsWith('#'))
                continue;
            const idx = line.indexOf('=');
            if (idx === -1)
                continue;
            const key = line.slice(0, idx).trim();
            const val = line.slice(idx + 1).trim();
            if (!(key in process.env))
                process.env[key] = val;
        }
    }
    catch {
    }
})();
const toBool = (v: string | undefined, d = false) => {
    if (v == null)
        return d;
    return String(v).toLowerCase() === 'true';
};
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'airways',
    logging: toBool(process.env.DB_LOGGING, false),
    synchronize: false,
    entities: [
        'src/**/entities/*.entity.ts',
        'dist/**/entities/*.entity.js',
    ],
    migrations: [
        'src/migrations/*.ts',
        'dist/migrations/*.js',
    ],
});
