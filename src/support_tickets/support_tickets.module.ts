import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicketsService } from './support_tickets.service';
import { SupportTicketsController } from './support_tickets.controller';
import { SupportTicket } from './entities/support_ticket.entity';
@Module({
    imports: [TypeOrmModule.forFeature([SupportTicket])],
    controllers: [SupportTicketsController],
    providers: [SupportTicketsService],
})
export class SupportTicketsModule {
}
