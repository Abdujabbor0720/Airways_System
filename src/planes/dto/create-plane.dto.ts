import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';
export class CreatePlaneDto {
    @ApiProperty()
    @IsNumberString()
    airline_id!: string;
    @ApiProperty()
    @IsNumberString()
    airplane_model_id!: string;
    @ApiProperty()
    @IsString()
    tail_number!: string;
    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    in_service?: boolean;
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    manufactured_year?: number;
}
