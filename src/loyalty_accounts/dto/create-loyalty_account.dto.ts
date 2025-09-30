import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumberString, IsOptional } from 'class-validator';
export class CreateLoyaltyAccountDto {
    @ApiProperty()
    @IsNumberString()
    user_id!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    tier_id?: string;
    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @IsInt()
    points_balance?: number;
}
