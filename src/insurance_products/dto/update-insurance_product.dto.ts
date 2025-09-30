import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, Matches } from 'class-validator';
export class UpdateInsuranceProductDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    provider_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    coverage_details?: string;
    @ApiPropertyOptional({ description: 'Price numeric string' })
    @IsOptional()
    @Matches(/^\d+(\.\d{1,2})?$/)
    price?: string;
    @ApiPropertyOptional({ minLength: 3, maxLength: 3 })
    @IsOptional()
    @IsString()
    currency?: string;
}
