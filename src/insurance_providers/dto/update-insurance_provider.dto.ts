import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class UpdateInsuranceProviderDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    contact_email?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    contact_phone?: string;
}
