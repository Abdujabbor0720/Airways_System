import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumberString, IsOptional } from 'class-validator';
export class UpdateLoyaltyAccountDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    user_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    tier_id?: string;
    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @IsInt()
    points_balance?: number;
}
