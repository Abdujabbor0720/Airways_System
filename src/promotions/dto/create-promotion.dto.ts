import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString, Matches } from 'class-validator';
export class CreatePromotionDto {
    @ApiProperty()
    @IsString()
    code!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;
    @ApiPropertyOptional({ description: 'Discount percent as numeric string e.g., 10.00' })
    @IsOptional()
    @Matches(/^\d+(\.\d{1,2})?$/)
    discount_percent?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    valid_from?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    valid_to?: string;
    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
