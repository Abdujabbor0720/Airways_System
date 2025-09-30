import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
export class CreatePromotionsRedemptionDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    promotion_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    user_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    booking_id?: string;
}
