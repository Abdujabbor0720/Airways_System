import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, Length } from 'class-validator';
export class CreateTranslationDto {
    @ApiProperty()
    @IsString()
    entity_type!: string;
    @ApiProperty()
    @IsNumberString()
    entity_id!: string;
    @ApiProperty({ minLength: 2, maxLength: 2 })
    @Length(2, 2)
    @IsString()
    lang_code!: string;
    @ApiProperty()
    @IsString()
    field!: string;
    @ApiProperty()
    @IsString()
    text!: string;
}
