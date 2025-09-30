import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerPointTransactionsService } from './partner_point_transactions.service';
import { PartnerPointTransactionsController } from './partner_point_transactions.controller';
import { PartnerPointTransaction } from './entities/partner_point_transaction.entity';
@Module({
    imports: [TypeOrmModule.forFeature([PartnerPointTransaction])],
    controllers: [PartnerPointTransactionsController],
    providers: [PartnerPointTransactionsService],
})
export class PartnerPointTransactionsModule {
}
