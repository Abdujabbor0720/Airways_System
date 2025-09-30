import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCountryDto } from './create-country.dto';
export class UpdateCountryDto extends PartialType(CreateCountryDto) {
    @ApiPropertyOptional({ minLength: 2, maxLength: 2, example: 'US' })
    iso2?: string;
    @ApiPropertyOptional({ minLength: 3, maxLength: 3, example: 'USA' })
    iso3?: string;
    @ApiPropertyOptional({ example: 'United States' })
    name?: string;
}
