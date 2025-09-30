import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCorporateContractDto } from './create-corporate_contract.dto';
export class UpdateCorporateContractDto extends PartialType(CreateCorporateContractDto) {
    @ApiPropertyOptional()
    company_name?: string;
    @ApiPropertyOptional()
    valid_from?: string;
    @ApiPropertyOptional()
    valid_to?: string;
}
