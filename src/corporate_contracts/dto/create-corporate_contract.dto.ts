import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';
export class CreateCorporateContractDto {
    @ApiProperty()
    @IsString()
    company_name!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    contact_person?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    contact_email?: string;
    @ApiPropertyOptional({ description: 'Discount percent as numeric string' })
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
}
