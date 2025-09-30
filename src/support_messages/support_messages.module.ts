import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportMessagesService } from './support_messages.service';
import { SupportMessagesController } from './support_messages.controller';
import { SupportMessage } from './entities/support_message.entity';
@Module({
    imports: [TypeOrmModule.forFeature([SupportMessage])],
    controllers: [SupportMessagesController],
    providers: [SupportMessagesService],
})
export class SupportMessagesModule {
}
