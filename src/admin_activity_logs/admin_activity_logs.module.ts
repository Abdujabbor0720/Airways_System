import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminActivityLogsService } from './admin_activity_logs.service';
import { AdminActivityLogsController } from './admin_activity_logs.controller';
import { AdminActivityLog } from './entities/admin_activity_log.entity';
@Module({
    imports: [TypeOrmModule.forFeature([AdminActivityLog])],
    controllers: [AdminActivityLogsController],
    providers: [AdminActivityLogsService],
    exports: [AdminActivityLogsService],
})
export class AdminActivityLogsModule {
}
