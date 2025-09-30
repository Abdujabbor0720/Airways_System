import { PartialType } from '@nestjs/mapped-types';
import { CreatePartnerPointTransactionDto } from './create-partner_point_transaction.dto';
export class UpdatePartnerPointTransactionDto extends PartialType(CreatePartnerPointTransactionDto) {
}
