import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';
export class UpdateFareClassDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    code?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    seat_class_id?: string;
    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    refundable?: boolean;
    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    changeable?: boolean;
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    advance_purchase_days?: number;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    baggage_policy_id?: string;
}
