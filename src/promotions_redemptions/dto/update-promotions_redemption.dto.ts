import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionsRedemptionDto } from './create-promotions_redemption.dto';
export class UpdatePromotionsRedemptionDto extends PartialType(CreatePromotionsRedemptionDto) {
}
