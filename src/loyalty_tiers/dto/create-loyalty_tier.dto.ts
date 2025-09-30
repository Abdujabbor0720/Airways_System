import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
export class CreateLoyaltyTierDto {
    @ApiProperty()
    @IsString()
    name!: string;
    @ApiProperty({ default: 0 })
    @IsInt()
    min_points!: number;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    benefits?: string;
}
