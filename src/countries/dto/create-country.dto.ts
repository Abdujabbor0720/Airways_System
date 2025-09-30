import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
export class CreateCountryDto {
    @ApiProperty({ minLength: 2, maxLength: 2, example: 'US' })
    @IsString()
    @Length(2, 2)
    @Matches(/^[A-Z]{2}$/)
    iso2!: string;
    @ApiPropertyOptional({ minLength: 3, maxLength: 3, example: 'USA' })
    @IsOptional()
    @IsString()
    @Length(3, 3)
    @Matches(/^[A-Z]{3}$/)
    iso3?: string;
    @ApiProperty({ example: 'United States' })
    @IsString()
    name!: string;
}
