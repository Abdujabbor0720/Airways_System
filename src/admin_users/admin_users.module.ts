import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUsersService } from './admin_users.service';
import { AdminUsersController } from './admin_users.controller';
import { AdminUser } from './entities/admin_user.entity';
@Module({
    imports: [TypeOrmModule.forFeature([AdminUser])],
    controllers: [AdminUsersController],
    providers: [AdminUsersService],
    exports: [AdminUsersService],
})
export class AdminUsersModule {
}
