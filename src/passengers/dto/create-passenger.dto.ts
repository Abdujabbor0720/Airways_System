import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';
export class CreatePassengerDto {
    @ApiPropertyOptional({ description: 'User ID owner' })
    @IsOptional()
    @IsNumberString()
    user_id?: string;
    @ApiProperty()
    @IsString()
    first_name!: string;
    @ApiProperty()
    @IsString()
    last_name!: string;
    @ApiPropertyOptional({ enum: ['M', 'F', 'X'] })
    @IsOptional()
    @IsIn(['M', 'F', 'X'])
    gender?: 'M' | 'F' | 'X';
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    birth_date?: string;
    @ApiPropertyOptional({ enum: ['PASSPORT', 'ID', 'BIRTH_CERT'] })
    @IsOptional()
    @IsIn(['PASSPORT', 'ID', 'BIRTH_CERT'])
    document_type?: 'PASSPORT' | 'ID' | 'BIRTH_CERT';
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    document_number?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    nationality_country_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    loyalty_account_id?: string;
}
