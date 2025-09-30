import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsString, Length, IsOptional } from 'class-validator';
export class UpdateTranslationDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    entity_type?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    entity_id?: string;
    @ApiPropertyOptional({ minLength: 2, maxLength: 2 })
    @IsOptional()
    @Length(2, 2)
    @IsString()
    lang_code?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    field?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    text?: string;
}
