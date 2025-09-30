import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
export class UpdateLoyaltyTierDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;
    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @IsInt()
    min_points?: number;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    benefits?: string;
}
