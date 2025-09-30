import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, Matches } from 'class-validator';
export class CreateInsuranceProductDto {
    @ApiProperty()
    @IsNumberString()
    provider_id!: string;
    @ApiProperty()
    @IsString()
    name!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    coverage_details?: string;
    @ApiProperty({ description: 'Price numeric string' })
    @Matches(/^\d+(\.\d{1,2})?$/)
    price!: string;
    @ApiProperty({ minLength: 3, maxLength: 3 })
    @IsString()
    currency!: string;
}
