import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';
export class UpdateLoyaltyPointsLedgerDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    account_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    delta_points?: number;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    reason?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    related_booking_id?: string;
}
