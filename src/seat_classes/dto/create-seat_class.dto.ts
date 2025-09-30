import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreateSeatClassDto {
    @ApiProperty()
    @IsString()
    code!: string;
    @ApiProperty()
    @IsString()
    display_name!: string;
}
