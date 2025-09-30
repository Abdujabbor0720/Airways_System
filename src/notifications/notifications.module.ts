import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';
import { RedisModule } from '../common/redis/redis.module';
@Module({
    imports: [TypeOrmModule.forFeature([Notification]), RedisModule],
    controllers: [NotificationsController],
    providers: [NotificationsService],
})
export class NotificationsModule {
}
