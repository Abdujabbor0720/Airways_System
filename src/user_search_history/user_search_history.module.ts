import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSearchHistoryService } from './user_search_history.service';
import { UserSearchHistoryController } from './user_search_history.controller';
import { UserSearchHistory } from './entities/user_search_history.entity';
@Module({
    imports: [TypeOrmModule.forFeature([UserSearchHistory])],
    controllers: [UserSearchHistoryController],
    providers: [UserSearchHistoryService],
    exports: [UserSearchHistoryService],
})
export class UserSearchHistoryModule {
}
